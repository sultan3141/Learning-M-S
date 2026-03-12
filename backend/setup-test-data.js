/**
 * Setup test data for LiveKit testing
 */

const API_URL = 'http://localhost:4000';

async function setupTestData() {
  console.log('\n📦 Setting up test data...\n');

  try {
    // Login as teacher
    console.log('1. Logging in as teacher...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@test.com',
        password: 'password123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Teacher login failed. Please run: node test-teacher.js first');
    }

    const { accessToken } = await loginResponse.json();
    console.log('✓ Logged in successfully');

    // Create a test course
    console.log('\n2. Creating test course...');
    const courseResponse = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: 'Test Course for LiveKit',
        description: 'A test course to demonstrate video calling with LiveKit',
        category: 'Technology',
        level: 'BEGINNER',
        price: 0,
        thumbnail: 'https://via.placeholder.com/400x300',
      }),
    });

    if (!courseResponse.ok) {
      const error = await courseResponse.json();
      throw new Error(`Failed to create course: ${JSON.stringify(error)}`);
    }

    const course = await courseResponse.json();
    console.log('✓ Course created:');
    console.log(`   - ID: ${course.id}`);
    console.log(`   - Title: ${course.title}`);

    console.log('\n✅ Test data setup complete!\n');
    console.log('You can now run: node test-livekit-simple.js\n');

  } catch (error) {
    console.log('\n❌ Setup failed:', error.message);
    console.log('');
    process.exit(1);
  }
}

setupTestData();
