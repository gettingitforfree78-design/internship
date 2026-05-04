const axios = require('axios');
const fs = require('fs');

async function testDownload() {
  try {
    const res = await axios.get('https://internship-1-z75q.onrender.com/api/applications/all', {
      headers: {
        Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjg0OWIxNTdkNzQ0MTYyMjFiYzU1ZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzc3ODc5NDc2LCJleHAiOjE3Nzg0ODQyNzZ9.k33gNlDisEtIbUsWlteXvccVnXT2vzODyBaa-0QCSrI'
      }
    });
    
    if (res.data.applications.length > 0) {
      const app = res.data.applications[0];
      const offerId = app.offerLetterId;
      console.log('Downloading offer:', offerId);
      
      const pdfRes = await axios.get(`https://internship-1-z75q.onrender.com/api/applications/download/${app._id}`, {
        responseType: 'arraybuffer',
        headers: {
          Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjg0OWIxNTdkNzQ0MTYyMjFiYzU1ZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzc3ODc5NDc2LCJleHAiOjE3Nzg0ODQyNzZ9.k33gNlDisEtIbUsWlteXvccVnXT2vzODyBaa-0QCSrI'
        }
      });
      
      fs.writeFileSync('test_download.pdf', pdfRes.data);
      console.log('Saved test_download.pdf, size:', pdfRes.data.length);
    }
  } catch(e) {
    console.error(e.message);
  }
}

testDownload();
