const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Admin credentials
    const email = 'admin@school.com';
    const password = 'Admin@123';
    const fullName = 'System Administrator';

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('✅ Admin user already exists!');
      console.log('\n📧 Email:', email);
      console.log('🔑 Password:', password);
      console.log('👤 Role: ADMIN');
      return;
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'ADMIN',
        isTeacherApproved: true, // Not applicable for admin but set to true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
