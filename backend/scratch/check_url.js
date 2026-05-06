const https = require('https');
https.get('https://internship-wheat-zeta.vercel.app/', (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const m = d.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (m) {
      console.log('JS bundle:', m[1]);
      https.get('https://internship-wheat-zeta.vercel.app' + m[1], (r2) => {
        let d2 = '';
        r2.on('data', c => d2 += c);
        r2.on('end', () => {
          const urls = d2.match(/https:\/\/[a-z0-9-]+\.onrender\.com/g);
          console.log('Backend URLs found:', [...new Set(urls || [])]);
        });
      });
    } else {
      console.log('No JS bundle found in HTML');
    }
  });
});
