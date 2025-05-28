import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';
import { verifyToken } from '@/lib/auth/auth';

// GET dashboard statistics for the logged-in doctor
export async function GET(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get counts from different tables
    const [
      totalPatients,
      scheduledAppointments,
      activePrescriptions,
      medicalRecords,
      recentPatients,
      upcomingAppointments,
      weeklyActivity
    ] = await Promise.all([
      // Total patients count
      db.patient.count({
        where: { doctorId }
      }),
      
      // Scheduled appointments
      db.appointment.count({
        where: { 
          patient: { doctorId },
          status: 'SCHEDULED',
          appointmentDate: { gte: new Date() }
        }
      }),
      
      // Active prescriptions
      db.prescription.count({
        where: {
          patient: { doctorId },
          expiryDate: { gte: new Date() }
        }
      }),
      
      // Total medical records
      db.medicalRecord.count({
        where: { 
          patient: { doctorId },
        }
      }),
      
      // Recent patients (last 5)
      db.patient.findMany({
        where: { doctorId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      
      // Upcoming appointments (next 5)
      db.appointment.findMany({
        where: {
          patient: { doctorId },
          status: 'SCHEDULED',
          appointmentDate: { gte: new Date() }
        },
        include: {
          patient: true
        },
        orderBy: { appointmentDate: 'asc' },
        take: 5
      }),
      
      // Weekly activity (appointments per day of current week)
      getWeeklyActivity(doctorId)
    ]);

    // Get change percentage from last month for patients
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    
    const newPatientsLastMonth = await db.patient.count({
      where: {
        doctorId,
        createdAt: { gte: lastMonthDate }
      }
    });
    
    const totalPatientsLastMonth = await db.patient.count({
      where: {
        doctorId,
        createdAt: { lt: lastMonthDate }
      }
    });
    
    // Calculate change percentage
    const patientChangePercent = totalPatientsLastMonth > 0 
      ? Math.round((newPatientsLastMonth / totalPatientsLastMonth) * 100) 
      : 0;

    // Calculate appointments change percentage
    const appointmentsLastMonth = await db.appointment.count({
      where: {
        patient: { doctorId },
        createdAt: { gte: lastMonthDate }
      }
    });
    
    const appointmentsPrevMonth = await db.appointment.count({
      where: {
        patient: { doctorId },
        createdAt: { 
          lt: lastMonthDate,
          gte: new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() - 1, lastMonthDate.getDate())
        }
      }
    });
    
    const appointmentChangePercent = appointmentsPrevMonth > 0
      ? Math.round(((appointmentsLastMonth - appointmentsPrevMonth) / appointmentsPrevMonth) * 100)
      : 0;

    const dashboardData = {
      stats: {
        totalPatients,
        scheduledAppointments,
        activePrescriptions,
        medicalRecords,
        trends: {
          patients: {
            value: patientChangePercent,
            isPositive: patientChangePercent > 0
          },
          appointments: {
            value: Math.abs(appointmentChangePercent),
            isPositive: appointmentChangePercent > 0
          }
        }
      },
      recentPatients,
      upcomingAppointments,
      activityData: weeklyActivity
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get weekly activity data
async function getWeeklyActivity(doctorId: string) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  
  // For each day of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    // Count appointments on this day
    const count = await db.appointment.count({
      where: {
        patient: { doctorId },
        appointmentDate: {
          gte: date,
          lt: nextDay
        }
      }
    });
    
    result.push({
      name: days[i],
      value: count
    });
  }
  
  return result;
}
