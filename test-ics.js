const { generateICSForAppointment, generateICSForAppointments } = require('./src/lib/ics-export.ts');

// Test data
const testAppointment = {
  id: 'test-123',
  appointmentDate: '2025-05-25T10:00:00.000Z',
  status: 'SCHEDULED',
  notes: 'Regular checkup',
  patient: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  }
};

const testAppointments = [
  testAppointment,
  {
    id: 'test-456',
    appointmentDate: '2025-05-26T14:00:00.000Z', 
    status: 'COMPLETED',
    notes: 'Follow-up visit',
    patient: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com'
    }
  }
];

console.log('Testing single appointment ICS generation...');
try {
  const singleICS = generateICSForAppointment(testAppointment);
  console.log('✓ Single appointment ICS generated successfully');
  console.log('Sample output:', singleICS.substring(0, 200) + '...');
} catch (error) {
  console.error('✗ Error generating single appointment ICS:', error.message);
}

console.log('\nTesting multiple appointments ICS generation...');
try {
  const multipleICS = generateICSForAppointments(testAppointments);
  console.log('✓ Multiple appointments ICS generated successfully');
  console.log('Sample output:', multipleICS.substring(0, 200) + '...');
  
  // Check if it contains proper ICS structure
  if (multipleICS.includes('BEGIN:VCALENDAR') && multipleICS.includes('END:VCALENDAR')) {
    console.log('✓ Proper VCALENDAR structure found');
  } else {
    console.log('✗ Missing VCALENDAR structure');
  }
  
  // Count events
  const eventCount = (multipleICS.match(/BEGIN:VEVENT/g) || []).length;
  console.log(`✓ Found ${eventCount} events in ICS file`);
  
} catch (error) {
  console.error('✗ Error generating multiple appointments ICS:', error.message);
}
