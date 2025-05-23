const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function resetDefaultUserPassword() {
  const prisma = new PrismaClient();
  
  try {
    const defaultUserEmail = 'doctor@example.com';
    const newPassword = 'password123';
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: defaultUserEmail }
    });
    
    if (!user) {
      console.log(`User with email ${defaultUserEmail} not found. Creating new user...`);
      
      // Create default admin user
      const hashedPassword = await hashPassword(newPassword);
      
      await prisma.user.create({
        data: {
          email: defaultUserEmail,
          password: hashedPassword,
          firstName: 'John',
          lastName: 'Smith',
          role: 'DOCTOR',
        },
      });
      
      console.log('Default user created:');
    } else {
      console.log(`Resetting password for user: ${defaultUserEmail}`);
      
      // Update the password
      const hashedPassword = await hashPassword(newPassword);
      
      await prisma.user.update({
        where: { email: defaultUserEmail },
        data: { password: hashedPassword }
      });
      
      console.log('Password has been reset.');
    }
    
    console.log('Email: doctor@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDefaultUserPassword();
