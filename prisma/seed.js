const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');
const seedData = require('./seedData');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check if there are any users
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      // Create default admin user
      const hashedPassword = await hashPassword('password123');
      
      const doctor = await prisma.user.create({
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
      
      // Create sample patients
      console.log('Creating sample patients...');
      const patients = [];
      
      for (const patientData of seedData.patients) {
        const patient = await prisma.patient.create({
          data: {
            ...patientData,
            dateOfBirth: new Date(patientData.dateOfBirth),
            doctorId: doctor.id
          },
        });
        patients.push(patient);
      }
      
      // Create sample medical records
      console.log('Creating sample medical records...');
      for (let i = 0; i < seedData.medicalRecords.length; i++) {
        const recordData = seedData.medicalRecords[i];
        const patientIndex = i % patients.length;
        
        await prisma.medicalRecord.create({
          data: {
            ...recordData,
            recordDate: new Date(),
            followUpDate: recordData.followUpDate ? new Date(recordData.followUpDate) : null,
            patientId: patients[patientIndex].id
          },
        });
      }
      
      // Create sample prescriptions
      console.log('Creating sample prescriptions...');
      for (let i = 0; i < seedData.prescriptions.length; i++) {
        const prescriptionData = seedData.prescriptions[i];
        const patientIndex = i % patients.length;
        
        await prisma.prescription.create({
          data: {
            ...prescriptionData,
            issuedDate: new Date(),
            expiryDate: prescriptionData.expiryDate ? new Date(prescriptionData.expiryDate) : null,
            patientId: patients[patientIndex].id,
            doctorId: doctor.id
          },
        });
      }
      
      // Create sample appointments
      console.log('Creating sample appointments...');
      for (let i = 0; i < seedData.appointments.length; i++) {
        const appointmentData = seedData.appointments[i];
        const patientIndex = i % patients.length;
        
        await prisma.appointment.create({
          data: {
            ...appointmentData,
            appointmentDate: new Date(appointmentData.appointmentDate),
            patientId: patients[patientIndex].id
          },
        });
      }
      
      console.log('Database seeding completed successfully.');
    } else {
      console.log('Database already has users. Skipping seed operation.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
