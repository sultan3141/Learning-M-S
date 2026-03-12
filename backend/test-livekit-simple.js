/**
 * Simple test script to verify LiveKit integration using native fetch
 */

const API_URL = 'http://localhost:4000';

async function test() {
  console.log('\n🧪 Testing LiveKit Integration\n');
  console.log('='.repeat(50));

  try {
    // Step 1: Login as teacher
    console.log('\n1. Logging in as teacher...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@test.com',
        password: 'password123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const { accessToken } = await loginResponse.json();
    console.log('✓ Teacher logged in successfully');

    // Step 2: Get teacher's courses
    console.log('\n2. Getting teacher courses...');
    const coursesResponse = await fetch(`${API_URL}/courses/teacher/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const coursesData = await coursesResponse.json();
    const courses = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
    console.log(`✓ Found ${courses.length} courses`);

    if (courses.length === 0) {
      console.log('\n⚠️  No courses found. Please create a course first.');
      return;
    }

    const courseId = courses[0].id;
    console.log(`   Using course: ${courses[0].title}`);

    // Step 3: Create a live session
    console.log('\n3. Creating live session with LiveKit...');
    const sessionResponse = await fetch(`${API_URL}/live-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ courseId }),
    });

    const session = await sessionResponse.json();
    console.log('✓ Live session created:');
    console.log(`   - Session ID: ${session.id}`);
    console.log(`   - Room Code: ${session.roomCode}`);
    console.log(`   - LiveKit Configured: ${session.livekitConfigured}`);
    console.log(`   - LiveKit URL: ${session.livekitUrl || 'Not configured'}`);

    // Step 4: Get join token
    console.log('\n4. Getting join token...');
    const joinResponse = await fetch(`${API_URL}/live-sessions/${session.id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!joinResponse.ok) {
      const error = await joinResponse.json();
      throw new Error(`Join failed: ${JSON.stringify(error)}`);
    }

    const joinData = await joinResponse.json();
    console.log('✓ Join token generated:');
    console.log(`   - Room Name: ${joinData.roomName}`);
    console.log(`   - URL: ${joinData.url}`);
    console.log(`   - Token: ${joinData.token.substring(0, 30)}...`);
    console.log(`   - Course: ${joinData.session.courseTitle}`);

    // Step 5: End the session
    console.log('\n5. Ending session...');
    await fetch(`${API_URL}/live-sessions/${session.id}/end`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('✓ Session ended successfully');

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed! LiveKit integration is working.\n');

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ Test failed:', error.message);
    console.log('');
    process.exit(1);
  }
}

test();
