const axios = require('axios');

async function testDownload() {
  try {
    const res = await axios.get('https://internship-1-z75q.onrender.com/api/applications/all', {
      headers: {
        Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjg0OWIxNTdkNzQ0MTYyMjFiYzU1ZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzc3ODc5NDc2LCJleHAiOjE3Nzg0ODQyNzZ9.k33gNlDisEtIbUsWlteXvccVnXT2vzODyBaa-0QCSrI'
      }
    });
    console.log("Apps:", res.data.applications.length);
  } catch(e) {
    console.error(e.message);
  }
}

testDownload();
