/**
 * Test script to verify LiveKit integration
 * 
 * This script tests:
 * 1. Creating a live session (creates LiveKit room)
 * 2. Getting a join token for the session
 * 3. Listing active sessions
 */

const axios = require('axios');

const API_URL = 'http://localhost:4000';

// Test credentials
const TEACHER_EMAIL = 'teacher@test.com';
const TEACHER_PASSWORD = 'teacher123';
const STUDENT_EMAIL = 'student@test.com';
const STUDENT_PASSWORD = 'student123';

async function loginTeacher() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: TEACHER_EMAIL,
      password: TEACHER_PASSWORD,
    });
    console.log('✓ Teacher logged in successfully');
    return response.data.accessToken;
  } catch (error) {
    console.error('✗ Teacher login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function loginStudent() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: STUDENT_EMAIL,
      password: STUDENT_PASSWORD,
    });
    console.log('✓ Student logged in successfully');
    return response.data.accessToken;
  } catch (error) {
    console.error('✗ Student login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getTeacherCourses(token) {
  try {
    const response = await axios.get(`${API_URL}/courses/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✓ Found ${response.data.length} courses`);
    return response.data;
  } catch (error) {
    console.error('✗ Failed to get courses:', error.response?.data || error.message);
    throw error;
  }
}

async function createLiveSession(token, courseId) {
  try {
    const response = await axios.post(
      `${API_URL}/live-sessions`,
      { courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Live session created:', {
      id: response.data.id,
      roomCode: response.data.roomCode,
      livekitConfigured: response.data.livekitConfigured,
      livekitUrl: response.data.livekitUrl,
    });
    return response.data;
  } catch (error) {
    console.error('✗ Failed to create session:', error.response?.data || error.message);
    throw error;
  }
}

async function getJoinToken(token, sessionId) {
  try {
    const response = await axios.post(
      `${API_URL}/live-sessions/${sessionId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Join token generated:', {
      roomName: response.data.roomName,
      url: response.data.url,
      tokenLength: response.data.token.length,
      session: response.data.session,
    });
    return response.data;
  } catch (error) {
    console.error('✗ Failed to get join token:', error.response?.data || error.message);
    throw error;
  }
}

async function listSessions(token) {
  try {
    const response = await axios.get(`${API_URL}/live-sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✓ Found ${response.data.length} active sessions`);
    return response.data;
  } catch (error) {
    console.error('✗ Failed to list sessions:', error.response?.data || error.message);
    throw error;
  }
}

async function endSession(token, sessionId) {
  try {
    const response = await axios.patch(
      `${API_URL}/live-sessions/${sessionId}/end`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Session ended successfully');
    return response.data;
  } catch (error) {
    console.error('✗ Failed to end session:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  console.log('\n🧪 Testing LiveKit Integration\n');
  console.log('='.repeat(50));

  try {
    // Step 1: Login as teacher
    console.log('\n1. Logging in as teacher...');
    const teacherToken = await loginTeacher();

    // Step 2: Get teacher's courses
    console.log('\n2. Getting teacher courses...');
    const courses = await getTeacherCourses(teacherToken);
    
    if (courses.length === 0) {
      console.log('\n⚠️  No courses found. Please create a course first.');
      return;
    }

    const courseId = courses[0].id;
    console.log(`   Using course: ${courses[0].title}`);

    // Step 3: Create a live session
    console.log('\n3. Creating live session...');
    const session = await createLiveSession(teacherToken, courseId);

    // Step 4: Get teacher join token
    console.log('\n4. Getting teacher join token...');
    const teacherJoinData = await getJoinToken(teacherToken, session.id);

    // Step 5: Login as student
    console.log('\n5. Logging in as student...');
    const studentToken = await loginStudent();

    // Step 6: List sessions as student
    console.log('\n6. Listing sessions as student...');
    await listSessions(studentToken);

    // Step 7: Get student join token
    console.log('\n7. Getting student join token...');
    const studentJoinData = await getJoinToken(studentToken, session.id);

    // Step 8: End the session
    console.log('\n8. Ending session...');
    await endSession(teacherToken, session.id);

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed! LiveKit integration is working.\n');
    console.log('📝 Summary:');
    console.log(`   - LiveKit URL: ${session.livekitUrl || 'Not configured'}`);
    console.log(`   - Room Code: ${session.roomCode}`);
    console.log(`   - Teacher can join with token (${teacherJoinData.token.substring(0, 20)}...)`);
    console.log(`   - Student can join with token (${studentJoinData.token.substring(0, 20)}...)`);
    console.log('');

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ Test failed. See error above.\n');
    process.exit(1);
  }
}

main();
