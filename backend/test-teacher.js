const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000';

async function createTeacher() {
  try {
    console.log('Creating teacher account...');
    const response = await axios.post(`${API_BASE_URL}/auth/register/teacher`, {
      email: 'teacher@test.com',
      password: 'password123',
      fullName: 'Test Teacher'
    });
    console.log('Teacher created successfully!');
    console.log('Token:', response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    if (error.response?.status === 401 && error.response?.data?.message?.includes('already in use')) {
      console.log('Teacher already exists, logging in...');
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'teacher@test.com',
        password: 'password123'
      });
      console.log('Logged in successfully!');
      console.log('Token:', loginResponse.data.accessToken);
      return loginResponse.data.accessToken;
    }
    throw error;
  }
}

async function testStudentRegistration(token) {
  try {
    console.log('\nTesting student registration...');
    const response = await axios.post(
      `${API_BASE_URL}/auth/teacher/register-student`,
      {
        fullName: 'Test Student',
        age: 18,
        phoneNumber: '+1234567890',
        interest: 'Mathematics'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Student registered successfully!');
    console.log('Generated credentials:', response.data);
  } catch (error) {
    console.error('Error registering student:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    const token = await createTeacher();
    await testStudentRegistration(token);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
