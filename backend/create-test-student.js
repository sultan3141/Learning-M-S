const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function createTestStudent() {
  try {
    // Test student credentials
    const email = 'student@test.com';
    const password = 'student123';  // Simpler password, all lowercase
    const fullName = 'Test Student';

    // Check if student already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('✅ Updating existing test student password...');
      
      // Update the password
      const passwordHash = await argon2.hash(password);
      await prisma.user.update({
        where: { email },
        data: { passwordHash }
      });
      
      console.log('✅ Test student password updated!');
      console.log('\n📧 Email:', email);
      console.log('🔑 Password:', password);
      console.log('👤 Role: STUDENT');
      return;
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create test student
    const student = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'STUDENT',
        age: 20,
        phoneNumber: '+1234567890',
        interest: 'Computer Science',
        mustChangePassword: false,
      }
    });

    console.log('✅ Test student created successfully!');
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', student.role);
    console.log('🆔 ID:', student.id);
    console.log('\n📱 Use these credentials to login to the mobile app!');

  } catch (error) {
    console.error('❌ Error creating student:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestStudent();
