#!/usr/bin/env node

/**
 * Database Connection Verification Script
 * Run this script to test if your database connection is working
 * Usage: node verify-db.js
 */

const { PrismaClient } = require('./src/generated/prisma');

async function verifyDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const userCount = await prisma.user.count();
    console.log(`✅ Users table accessible. Found ${userCount} users.`);
    
    const patientCount = await prisma.patient.count();
    console.log(`✅ Patients table accessible. Found ${patientCount} patients.`);
    
    // Check if default user exists
    const defaultUser = await prisma.user.findUnique({
      where: { email: 'doctor@example.com' }
    });
    
    if (defaultUser) {
      console.log('✅ Default doctor account found!');
      console.log(`   Name: ${defaultUser.firstName} ${defaultUser.lastName}`);
      console.log(`   Email: ${defaultUser.email}`);
      console.log(`   Role: ${defaultUser.role}`);
    } else {
      console.log('⚠️  Default doctor account not found. You may need to run seeding.');
    }
    
    console.log('\n🎉 Database verification complete!');
    console.log('Your hospital management system is ready to use.');
    
  } catch (error) {
    console.error('❌ Database verification failed:');
    console.error(error.message);
    
    if (error.code === 'P2021') {
      console.log('\n💡 This usually means tables don\'t exist yet.');
      console.log('   Run: npx prisma migrate deploy');
      console.log('   Then: npm run seed');
    }
    
    if (error.message.includes('connect')) {
      console.log('\n💡 Connection failed. Check your DATABASE_URL:');
      console.log('   - Verify the connection string is correct');
      console.log('   - Ensure the database exists');
      console.log('   - Check if SSL is required (?sslmode=require)');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
