const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/**
 * fill-offer-letter_changed.js
 * ----------------------------
 * Dynamic Offer Letter Generator
 */

// ─── Date Helpers ─────────────────────────────────────────────────────────────
function formatDate(isoStr) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const d = new Date(isoStr + "T12:00:00");
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

function addDays(isoStr, n) {
  const d = new Date(isoStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ─── Build Replacements ───────────────────────────────────────────────────────
function buildReplacements(user) {
  const today = new Date().toISOString().split("T")[0];
  return {
    "[NAME_OF_PERSON]": user.fullName || "",
    "Howard Ong": user.fullName || "", // Fix for hardcoded name in template
    "[DESIGNATION]": user.internshipRole || "",
    "[START_DATE]": formatDate(user.startDate || today),
    "[WORK_LOCATION]": user.mode || "",
    "[TODAY_DATE]": formatDate(today),
    "[TODAY_DATE + 2 MORE DAYS]": formatDate(addDays(today, 2)),
  };
}

// ─── Fix Split Placeholders ───────────────────────────────────────────────────
function mergeAllRuns(xml) {
  // Joins text runs that Word split up (e.g., "How" + "ard" -> "Howard")
  return xml.replace(/<\/w:t><\/w:r><w:r[^>]*>(?:<w:rPr>.*?<\/w:rPr>)?<w:t[^>]*>/g, "");
}

// ─── Apply Replacements to XML ────────────────────────────────────────────────
function patchXml(xml, replacements) {
  xml = mergeAllRuns(xml); // Clean up XML structure first
  for (const [placeholder, value] of Object.entries(replacements)) {
    const safe = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    xml = xml.split(placeholder).join(safe);
  }
  return xml;
}

// ─── ZIP Reader ───────────────────────────────────────────────────────────────
function readZip(buf) {
  const entries = [];
  let i = 0;
  while (i < buf.length - 4) {
    if (buf.readUInt32LE(i) !== 0x04034b50) { i++; continue; }
    const compression = buf.readUInt16LE(i + 8);
    const crc32 = buf.readUInt32LE(i + 14);
    const compSize = buf.readUInt32LE(i + 18);
    const uncompSize = buf.readUInt32LE(i + 22);
    const fnLen = buf.readUInt16LE(i + 26);
    const extraLen = buf.readUInt16LE(i + 28);
    const filename = buf.slice(i + 30, i + 30 + fnLen).toString("utf8");
    const dataStart = i + 30 + fnLen + extraLen;
    const compData = buf.slice(dataStart, dataStart + compSize);
    entries.push({ filename, compression, crc32, compSize, uncompSize, compData });
    i = dataStart + compSize;
  }
  return entries;
}

// ─── CRC32 ────────────────────────────────────────────────────────────────────
function crc32(buf) {
  if (!crc32._table) {
    crc32._table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      crc32._table[n] = c;
    }
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++)
    c = crc32._table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// ─── ZIP Writer ───────────────────────────────────────────────────────────────
function writeZip(entries) {
  const parts = [];
  const centralDir = [];
  let offset = 0;

  for (const e of entries) {
    const fnBuf = Buffer.from(e.filename, "utf8");
    const localHdr = Buffer.alloc(30 + fnBuf.length);
    localHdr.writeUInt32LE(0x04034b50, 0);
    localHdr.writeUInt16LE(20, 4);
    localHdr.writeUInt16LE(0, 6);
    localHdr.writeUInt16LE(e.compression, 8);
    localHdr.writeUInt32LE(0, 10);
    localHdr.writeUInt32LE(e.crc32, 14);
    localHdr.writeUInt32LE(e.compData.length, 18);
    localHdr.writeUInt32LE(e.uncompSize, 22);
    localHdr.writeUInt16LE(fnBuf.length, 26);
    localHdr.writeUInt16LE(0, 28);
    fnBuf.copy(localHdr, 30);

    const cdEntry = Buffer.alloc(46 + fnBuf.length);
    cdEntry.writeUInt32LE(0x02014b50, 0);
    cdEntry.writeUInt16LE(20, 4);
    cdEntry.writeUInt16LE(20, 6);
    cdEntry.writeUInt16LE(0, 8);
    cdEntry.writeUInt16LE(e.compression, 10);
    cdEntry.writeUInt32LE(0, 12);
    cdEntry.writeUInt32LE(e.crc32, 16);
    cdEntry.writeUInt32LE(e.compData.length, 20);
    cdEntry.writeUInt32LE(e.uncompSize, 24);
    cdEntry.writeUInt16LE(fnBuf.length, 28);
    cdEntry.writeUInt32LE(0, 30);
    cdEntry.writeUInt32LE(0, 34);
    cdEntry.writeUInt32LE(0, 38);
    cdEntry.writeUInt32LE(offset, 42);
    fnBuf.copy(cdEntry, 46);

    parts.push(localHdr, e.compData);
    centralDir.push(cdEntry);
    offset += localHdr.length + e.compData.length;
  }

  const cdBuf = Buffer.concat(centralDir);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(centralDir.length, 8);
  eocd.writeUInt16LE(centralDir.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...parts, cdBuf, eocd]);
}

// ─── Main Logic ───────────────────────────────────────────────────────────────
function fillOfferLetter(templatePath, user, outputPath) {
  if (!fs.existsSync(templatePath)) {
    console.error(`❌  Template not found: ${templatePath}`);
    process.exit(1);
  }

  const replacements = buildReplacements(user);
  const entries = readZip(fs.readFileSync(templatePath));

  for (const entry of entries) {
    if (!entry.filename.endsWith(".xml") && !entry.filename.endsWith(".rels")) continue;

    let xml = (entry.compression === 8
      ? zlib.inflateRawSync(entry.compData)
      : entry.compData
    ).toString("utf8");

    xml = patchXml(xml, replacements);

    const newBuf = Buffer.from(xml, "utf8");
    entry.compData = zlib.deflateRawSync(newBuf, { level: 6 });
    entry.uncompSize = newBuf.length;
    entry.crc32 = crc32(newBuf);
    entry.compression = 8;
  }

  fs.writeFileSync(outputPath, writeZip(entries));
  console.log(`✅  Generated offer letter for: ${user.fullName}`);
}

module.exports = { fillOfferLetter };

// ─── CLI Entry Point ──────────────────────────────────────────────────────────
if (require.main === module) {
  const templatePath = process.argv[2];
  const userJsonPath = process.argv[3];
  const outputPath   = process.argv[4];

  if (!templatePath || !userJsonPath) {
    console.error("Usage: node fillOfferLetter.js <templatePath> <userJsonPath> [outputPath]");
    process.exit(1);
  }

  const user = JSON.parse(fs.readFileSync(userJsonPath, "utf8"));
  fillOfferLetter(templatePath, user, outputPath || `${user.fullName.replace(/\s+/g, '_')}.docx`);
}