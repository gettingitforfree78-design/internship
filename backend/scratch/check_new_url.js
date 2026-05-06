const https = require('https');
https.get('https://internship-amuyy1re2-gettingitforfree78-designs-projects.vercel.app/', (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const m = d.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (m) {
      console.log('JS bundle:', m[1]);
      https.get('https://internship-amuyy1re2-gettingitforfree78-designs-projects.vercel.app' + m[1], (r2) => {
        let d2 = '';
        r2.on('data', c => d2 += c);
        r2.on('end', () => {
          console.log('Has 6uer:', d2.includes('internship-6uer'));
          console.log('Has 1-z75q:', d2.includes('internship-1-z75q'));
        });
      });
    } else {
      console.log('No JS bundle found in HTML');
    }
  });
});
