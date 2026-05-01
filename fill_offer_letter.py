#!/usr/bin/env python3
"""
fill_offer_letter.py
--------------------
Fills placeholders in a Job Offer Letter .docx template using values from a JSON file,
then converts the result to PDF.

Usage:
    python fill_offer_letter.py \
        --template Job_Offer_Letter_Designed-v2.docx \
        --data employee_data.json \
        --output filled_offer_letter.docx \
        --pdf filled_offer_letter.pdf

JSON keys expected (matching [PLACEHOLDER] tokens in the document):
    NAME_OF_PERSON   - Candidate's full name
    TODAY_DATE       - Date of the letter  (e.g. "April 26, 2025")
    DESIGNATION      - Job title           (e.g. "Software Engineer")
    START_DATE       - Employment start    (e.g. "May 15, 2025")
    WORK_LOCATION    - Office location     (e.g. "New Delhi, India")

The script also resolves the computed placeholder [TODAY_DATE + 2 MORE DAYS] automatically
by adding 2 days to TODAY_DATE (supports "Month D, YYYY" and "YYYY-MM-DD" formats).
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timedelta
from zipfile import ZipFile, ZIP_DEFLATED
import tempfile
import xml.etree.ElementTree as ET


# ─────────────────────────────────────────────────────────────────────────────
# Date helpers
# ─────────────────────────────────────────────────────────────────────────────

DATE_FORMATS = ["%B %d, %Y", "%B %d %Y", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"]

def parse_date(date_str: str) -> datetime:
    """Try several common date formats."""
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            pass
    raise ValueError(
        f"Cannot parse date '{date_str}'. "
        f"Supported formats: {', '.join(DATE_FORMATS)}"
    )

def format_date(dt: datetime) -> str:
    """Return a human-friendly date string."""
    return dt.strftime("%B %d, %Y")


# ─────────────────────────────────────────────────────────────────────────────
# Build the replacement map from JSON
# ─────────────────────────────────────────────────────────────────────────────

def build_replacement_map(data: dict) -> dict:
    """
    Returns a dict  {placeholder_token: replacement_text}
    e.g. {"[NAME_OF_PERSON]": "Rahul Sharma", ...}
    """
    replacements = {}

    # Standard fields
    for key in ("NAME_OF_PERSON", "TODAY_DATE", "DESIGNATION", "START_DATE", "WORK_LOCATION"):
        if key in data:
            replacements[f"[{key}]"] = str(data[key])

    # Computed: [TODAY_DATE + 2 MORE DAYS]
    if "TODAY_DATE" in data:
        try:
            dt = parse_date(data["TODAY_DATE"])
            deadline = dt + timedelta(days=2)
            replacements["[TODAY_DATE + 2 MORE DAYS]"] = format_date(deadline)
        except ValueError as exc:
            print(f"Warning: could not compute deadline date – {exc}", file=sys.stderr)
            replacements["[TODAY_DATE + 2 MORE DAYS]"] = data["TODAY_DATE"]

    return replacements


# ─────────────────────────────────────────────────────────────────────────────
# XML text replacement (preserves formatting)
# ─────────────────────────────────────────────────────────────────────────────

def replace_in_xml(xml_bytes: bytes, replacements: dict) -> bytes:
    """
    Replace placeholder tokens inside XML content.

    DOCX splits text across multiple <w:r><w:t> runs, so a simple
    find-replace on raw bytes misses split placeholders.  We:
      1. Collapse adjacent runs with identical formatting inside each paragraph.
      2. Do a plain-text find-replace on the merged text.
      3. Re-expand where needed (we just put everything back in one run).

    Strategy: work on raw bytes with regex so we don't disturb the namespace
    declarations that ElementTree would mangle.
    """
    text = xml_bytes.decode("utf-8")

    # ── 1. Merge consecutive <w:t> text within the same paragraph ────────────
    # We need to handle cases where a placeholder like [NAME_OF_PERSON] is
    # spread across multiple runs.  Simplest safe approach: collect all
    # <w:t> text within a paragraph and do the replacement there.

    # We'll do a regex pass that:
    #   a) finds each <w:p …>…</w:p> block
    #   b) within it, concatenates text across all <w:t> nodes
    #   c) checks for any placeholder token
    #   d) if found, replaces the FIRST <w:t> that contains part of the token
    #      with the full replacement and empties the other contributing runs.

    # Simpler alternative that works for well-formed templates: just do a
    # raw string replacement of [TOKEN] even if split across runs by merging
    # adjacent <w:t> tags.

    # ── Merge split runs: remove </w:t></w:r><w:r…><w:t…> boundaries ────────
    # This regex joins consecutive runs that share the same rPr (or both have none).
    # We only merge runs whose *only* content is <w:t> (no images, breaks, etc.)
    # to stay safe.

    for token, value in replacements.items():
        if token not in text:
            # Try to find it split across runs by removing run boundaries
            # between characters of the token
            # Build a regex that allows optional run-break XML between chars
            escaped_chars = [re.escape(c) for c in token]
            # Pattern: each char followed by optional run-break
            run_break = r'(?:</w:t></w:r>(?:<w:r[^>]*>(?:<w:rPr>.*?</w:rPr>)?<w:t[^>]*>)?)?'
            pattern = run_break.join(escaped_chars)
            # Replace the whole matched span with just the value in a single <w:t>
            text = re.sub(pattern, lambda m: value, text, flags=re.DOTALL)
        else:
            text = text.replace(token, value)

    return text.encode("utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# Process the DOCX
# ─────────────────────────────────────────────────────────────────────────────

XML_PARTS = [
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/footer1.xml",
    "word/footer2.xml",
]

def fill_docx(template_path: str, replacements: dict, output_path: str):
    """Read template DOCX, apply replacements, write output DOCX."""
    with tempfile.TemporaryDirectory() as tmp:
        tmp_out = os.path.join(tmp, "output.docx")

        with ZipFile(template_path, "r") as zin, \
             ZipFile(tmp_out, "w", ZIP_DEFLATED) as zout:

            for item in zin.infolist():
                data = zin.read(item.filename)

                # Apply replacements to all XML parts
                if item.filename.endswith(".xml") or item.filename.endswith(".rels"):
                    data = replace_in_xml(data, replacements)

                zout.writestr(item, data)

        shutil.copy2(tmp_out, output_path)
    print(f"✅ Filled DOCX saved → {output_path}")


# ─────────────────────────────────────────────────────────────────────────────
# Convert DOCX → PDF via LibreOffice
# ─────────────────────────────────────────────────────────────────────────────

SOFFICE_SCRIPT = "/mnt/skills/public/docx/../../../scripts/office/soffice.py"

def convert_to_pdf(docx_path: str, pdf_path: str):
    """Convert a DOCX file to PDF using LibreOffice."""
    out_dir = os.path.dirname(os.path.abspath(pdf_path))
    base_name = os.path.splitext(os.path.basename(docx_path))[0]
    expected_pdf = os.path.join(out_dir, base_name + ".pdf")

    # Try the skills soffice wrapper first, then fall back to direct libreoffice
    soffice_candidates = [
        ["python3", SOFFICE_SCRIPT, "--headless", "--convert-to", "pdf", docx_path, "--outdir", out_dir],
        ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", out_dir, docx_path],
        ["soffice",     "--headless", "--convert-to", "pdf", "--outdir", out_dir, docx_path],
    ]

    for cmd in soffice_candidates:
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0 and os.path.exists(expected_pdf):
                if expected_pdf != pdf_path:
                    shutil.move(expected_pdf, pdf_path)
                print(f"✅ PDF saved → {pdf_path}")
                return
        except (FileNotFoundError, subprocess.TimeoutExpired):
            continue

    raise RuntimeError(
        "Could not convert to PDF. Make sure LibreOffice is installed.\n"
        "Install with: sudo apt-get install libreoffice"
    )


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Fill a Job Offer Letter template from JSON and export to PDF."
    )
    parser.add_argument("--template", default="Job_Offer_Letter_Designed-v2.docx",
                        help="Path to the .docx template file")
    parser.add_argument("--data",     default="employee_data.json",
                        help="Path to the JSON file with field values")
    parser.add_argument("--output",   default="filled_offer_letter.docx",
                        help="Output path for the filled .docx file")
    parser.add_argument("--pdf",      default="filled_offer_letter.pdf",
                        help="Output path for the final PDF")
    parser.add_argument("--no-pdf",   action="store_true",
                        help="Skip PDF conversion (produce .docx only)")
    args = parser.parse_args()

    # ── Load data ─────────────────────────────────────────────────────────────
    if not os.path.exists(args.data):
        sys.exit(f"❌ JSON file not found: {args.data}")
    with open(args.data, encoding="utf-8") as f:
        data = json.load(f)

    print("📋 Data loaded:")
    for k, v in data.items():
        print(f"   {k}: {v}")
    print()

    # ── Build replacement map ─────────────────────────────────────────────────
    replacements = build_replacement_map(data)
    print("🔄 Replacements to apply:")
    for token, value in replacements.items():
        print(f"   {token!r:40s} → {value!r}")
    print()

    # ── Fill DOCX ─────────────────────────────────────────────────────────────
    if not os.path.exists(args.template):
        sys.exit(f"❌ Template not found: {args.template}")
    fill_docx(args.template, replacements, args.output)

    # ── Convert to PDF ────────────────────────────────────────────────────────
    if not args.no_pdf:
        convert_to_pdf(args.output, args.pdf)


if __name__ == "__main__":
    main()
