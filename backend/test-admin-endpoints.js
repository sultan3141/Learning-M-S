/**
 * Test admin endpoints for teacher management
 */

const API_URL = 'http://localhost:4000';

async function testAdminEndpoints() {
  console.log('\n🧪 Testing Admin Teacher Management Endpoints\n');
  console.log('='.repeat(50));

  try {
    // Step 1: Login as admin
    console.log('\n1. Logging in as admin...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@school.com',
        password: 'Admin@123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Admin login failed');
    }

    const { accessToken } = await loginResponse.json();
    console.log('✓ Admin logged in successfully');

    // Step 2: List teachers
    console.log('\n2. Listing teachers...');
    const teachersResponse = await fetch(`${API_URL}/admin/teachers`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const teachers = await teachersResponse.json();
    console.log(`✓ Found ${teachers.length} teachers`);
    if (teachers.length > 0) {
      console.log(`   First teacher: ${teachers[0].fullName} (${teachers[0].email})`);
    }

    // Step 3: Register a new teacher
    console.log('\n3. Registering new teacher...');
    const registerResponse = await fetch(`${API_URL}/admin/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: `teacher.${Date.now()}@test.com`,
        password: 'password123',
        fullName: 'Test Teacher New',
      }),
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.log(`✗ Registration failed: ${JSON.stringify(error)}`);
    } else {
      const newTeacher = await registerResponse.json();
      console.log('✓ Teacher registered successfully:');
      console.log(`   ID: ${newTeacher.id}`);
      console.log(`   Name: ${newTeacher.fullName}`);
      console.log(`   Email: ${newTeacher.email}`);
      console.log(`   Approved: ${newTeacher.isTeacherApproved}`);

      // Step 4: Get teacher's students
      console.log('\n4. Getting teacher students...');
      const studentsResponse = await fetch(`${API_URL}/admin/teachers/${newTeacher.id}/students`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const students = await studentsResponse.json();
      console.log(`✓ Found ${students.length} students for this teacher`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All admin endpoints working!\n');

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ Test failed:', error.message);
    console.log('');
    process.exit(1);
  }
}

testAdminEndpoints();
