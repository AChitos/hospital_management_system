import { createEvent, EventAttributes } from 'ics';

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
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ],
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
    
    // Create ICS header
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hospital Management System//Appointments//EN',
      'CALSCALE:GREGORIAN'
    ].join('\n');

    // Add each event
    for (const event of events) {
      const { error, value } = createEvent(event);
      if (error) {
        console.error('Error creating ICS event:', error);
        continue;
      }
      
      if (value) {
        // Extract just the VEVENT part
        const eventLines = value.split('\n');
        const eventStart = eventLines.findIndex(line => line.startsWith('BEGIN:VEVENT'));
        const eventEnd = eventLines.findIndex(line => line.startsWith('END:VEVENT'));
        
        if (eventStart !== -1 && eventEnd !== -1) {
          const eventContent = eventLines.slice(eventStart, eventEnd + 1).join('\n');
          icsContent += '\n' + eventContent;
        }
      }
    }

    // Close calendar
    icsContent += '\nEND:VCALENDAR';
    
    return icsContent;
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
