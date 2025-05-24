import { createEvent, createEvents, EventAttributes } from 'ics';

export interface AppointmentData {
  id: string;
  appointmentDate: string;
  status: string;
  notes?: string;
  patient: {
    firstName: string;
    lastName: string;
    email?: string;
  };
}

/**
 * Convert appointment to ICS event format
 */
export function appointmentToICSEvent(appointment: AppointmentData): EventAttributes {
  const startDate = new Date(appointment.appointmentDate);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  return {
    uid: `appointment-${appointment.id}@hospital-management-system.com`,
    title: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    description: `Medical appointment\n\nPatient: ${appointment.patient.firstName} ${appointment.patient.lastName}\nStatus: ${appointment.status}\nNotes: ${appointment.notes || 'No notes'}`,
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1, // ICS months are 1-based
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes()
    ],
    startInputType: 'local',
    startOutputType: 'local',
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ],
    endInputType: 'local',
    endOutputType: 'local',
    status: appointment.status === 'COMPLETED' ? 'CONFIRMED' : 
            appointment.status === 'CANCELLED' ? 'CANCELLED' : 'TENTATIVE',
    organizer: { name: 'Hospital Management System' },
    attendees: appointment.patient.email ? [{
      name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      email: appointment.patient.email
    }] : [],
    categories: ['Medical', 'Appointment'],
    location: 'Medical Office',
  };
}

/**
 * Generate ICS file content for a single appointment
 */
export function generateICSForAppointment(appointment: AppointmentData): string {
  try {
    const event = appointmentToICSEvent(appointment);
    const { error, value } = createEvent(event);
    
    if (error) {
      console.error('Error creating ICS event:', error);
      throw new Error('Failed to create ICS event');
    }
    
    return value || '';
  } catch (error) {
    console.error('Error generating ICS for appointment:', error);
    throw new Error('Failed to generate ICS file');
  }
}

/**
 * Generate ICS file content for multiple appointments
 */
export function generateICSForAppointments(appointments: AppointmentData[]): string {
  try {
    const events = appointments.map(appointment => appointmentToICSEvent(appointment));
    
    const { error, value } = createEvents(events);
    
    if (error) {
      console.error('Error creating ICS events:', error);
      throw new Error('Failed to create ICS events');
    }
    
    return value || '';
  } catch (error) {
    console.error('Error generating ICS for appointments:', error);
    throw new Error('Failed to generate ICS file');
  }
}

/**
 * Create download response for ICS file
 */
export function createICSDownloadResponse(icsContent: string, filename: string) {
  const headers = new Headers();
  headers.set('Content-Type', 'text/calendar; charset=utf-8');
  headers.set('Content-Disposition', `attachment; filename="${filename}"`);
  
  return new Response(icsContent, { headers });
}
