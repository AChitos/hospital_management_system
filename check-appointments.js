const { PrismaClient } = require('./src/generated/prisma');

async function checkAppointments() {
  const prisma = new PrismaClient();
  
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      take: 5
    });
    
    console.log('Appointments found:', appointments.length);
    appointments.forEach(apt => {
      console.log(`- ${apt.id}: ${apt.patient.firstName} ${apt.patient.lastName} on ${apt.appointmentDate} (${apt.status})`);
    });
    
    // Check patient doctor associations
    const patientsWithAppointments = await prisma.patient.findMany({
      where: {
        appointments: {
          some: {}
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        doctorId: true,
        appointments: {
          take: 1,
          select: {
            id: true,
            appointmentDate: true,
            status: true
          }
        }
      }
    });
    
    console.log('\nPatients with appointments and their doctor IDs:');
    patientsWithAppointments.forEach(patient => {
      console.log(`- ${patient.firstName} ${patient.lastName} (doctorId: ${patient.doctorId})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAppointments();
