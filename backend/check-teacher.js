/**
 * Check if teacher account exists and create/update it
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkAndCreateTeacher() {
  console.log('\n🔍 Checking teacher account...\n');

  try {
    // Check if teacher exists
    let teacher = await prisma.user.findUnique({
      where: { email: 'teacher@test.com' },
    });

    if (teacher) {
      console.log('✓ Teacher account found:');
      console.log(`  - Email: ${teacher.email}`);
      console.log(`  - Name: ${teacher.fullName}`);
      console.log(`  - Role: ${teacher.role}`);
      console.log(`  - Status: ${teacher.status}`);
      
      // Update password to ensure it's correct
      console.log('\n📝 Updating password to: password123');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await prisma.user.update({
        where: { email: 'teacher@test.com' },
        data: { 
          password: hashedPassword,
          status: 'APPROVED' // Ensure teacher is approved
        },
      });
      
      console.log('✓ Password updated successfully');
      console.log('✓ Status set to APPROVED');
    } else {
      console.log('⚠️  Teacher account not found. Creating new account...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      teacher = await prisma.user.create({
        data: {
          email: 'teacher@test.com',
          password: hashedPassword,
          fullName: 'Test Teacher',
          role: 'TEACHER',
          status: 'APPROVED',
        },
      });
      
      console.log('✓ Teacher account created:');
      console.log(`  - Email: ${teacher.email}`);
      console.log(`  - Password: password123`);
      console.log(`  - Name: ${teacher.fullName}`);
    }

    console.log('\n✅ Teacher credentials:');
    console.log('   Email: teacher@test.com');
    console.log('   Password: password123');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateTeacher();
