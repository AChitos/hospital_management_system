const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/lib/auth/auth');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check if there are any users
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      // Create default admin user
      const hashedPassword = await hashPassword('password123');
      
      await prisma.user.create({
        data: {
          email: 'doctor@example.com',
          password: hashedPassword,
          firstName: 'John',
          lastName: 'Smith',
          role: 'DOCTOR',
        },
      });
      
      console.log('Default user created:');
      console.log('Email: doctor@example.com');
      console.log('Password: password123');
    } else {
      console.log('Database already seeded. Skipping seed operation.');
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
