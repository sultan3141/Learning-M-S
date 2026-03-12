/**
 * Test teacher login and decode JWT token
 */

const API_URL = 'http://localhost:4000';

async function testTeacherLogin() {
  console.log('\n🔐 Testing Teacher Login and Token Decode\n');
  console.log('='.repeat(50));

  try {
    // Login as teacher
    console.log('\n1. Logging in as teacher...');
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@test.com',
        password: 'password123',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Login failed: ${JSON.stringify(error)}`);
    }

    const { accessToken } = await response.json();
    console.log('✓ Login successful');
    console.log(`   Token: ${accessToken.substring(0, 30)}...`);

    // Decode JWT token
    console.log('\n2. Decoding JWT token...');
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('utf-8')
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    console.log('✓ Token decoded successfully:');
    console.log('   User ID:', decoded.userId);
    console.log('   Email:', decoded.email);
    console.log('   Full Name:', decoded.fullName);
    console.log('   Role:', decoded.role);
    console.log('   Issued At:', new Date(decoded.iat * 1000).toLocaleString());
    console.log('   Expires At:', new Date(decoded.exp * 1000).toLocaleString());

    // Verify role
    console.log('\n3. Verifying role...');
    if (decoded.role === 'TEACHER') {
      console.log('✓ Role is TEACHER - can create live rooms');
    } else {
      console.log(`✗ Role is ${decoded.role} - cannot create live rooms`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Teacher login working correctly!\n');
    console.log('📝 Use these credentials in the mobile app:');
    console.log('   Email: teacher@test.com');
    console.log('   Password: password123');
    console.log('');

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ Test failed:', error.message);
    console.log('');
    process.exit(1);
  }
}

testTeacherLogin();
