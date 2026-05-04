const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('https://internship-1-z75q.onrender.com/api/auth/register', {
      name: 'Test Node',
      email: `testnode_${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890',
      college: 'Node College'
    }, {
      headers: {
        'Origin': 'https://internship-wheat-zeta.vercel.app'
      }
    });
    
    console.log('Signup Success:', response.data);
    console.log('Set-Cookie Header:', response.headers['set-cookie']);
  } catch (error) {
    console.error('Signup Failed:', error.response?.data || error.message);
  }
}

testSignup();
