/**
 * Test teacher login with different password combinations
 */

const API_URL = 'http://localhost:4000';

const passwords = [
  'password123',
  'teacher123',
  'Teacher123',
  'Password123',
];

async function testLogin(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.json();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🔐 Testing teacher login credentials...\n');
  console.log('Email: teacher@test.com\n');

  for (const password of passwords) {
    process.stdout.write(`Testing password "${password}"... `);
    const result = await testLogin('teacher@test.com', password);
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log('\n✅ Working credentials:');
      console.log(`   Email: teacher@test.com`);
      console.log(`   Password: ${password}`);
      console.log('');
      return;
    } else {
      console.log('❌ Failed');
    }
  }

  console.log('\n❌ None of the passwords worked.');
  console.log('\nLet me check if the account exists...\n');

  // Try to register
  console.log('Attempting to create teacher account...');
  const registerResult = await fetch(`${API_URL}/auth/register/teacher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@test.com',
      password: 'password123',
      fullName: 'Test Teacher',
    }),
  });

  if (registerResult.ok) {
    console.log('✅ Teacher account created!');
    console.log('\n✅ New credentials:');
    console.log('   Email: teacher@test.com');
    console.log('   Password: password123');
    console.log('');
  } else {
    const error = await registerResult.json();
    console.log('Registration response:', error);
    
    if (error.message && error.message.includes('already')) {
      console.log('\n⚠️  Account exists but password is unknown.');
      console.log('Please check the database or reset the password.');
    }
  }
}

main();
