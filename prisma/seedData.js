// Sample data for testing

module.exports = {
  patients: [
    {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1980-05-15T00:00:00Z",
      gender: "Male",
      contactNumber: "555-1234",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, USA",
      bloodType: "A+",
      allergies: "Penicillin"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1992-08-22T00:00:00Z", 
      gender: "Female",
      contactNumber: "555-5678",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Somewhere, USA",
      bloodType: "O-",
      allergies: "None"
    },
    {
      firstName: "Michael",
      lastName: "Johnson",
      dateOfBirth: "1975-11-03T00:00:00Z",
      gender: "Male",
      contactNumber: "555-9012",
      email: "michael.j@example.com",
      address: "789 Pine St, Elsewhere, USA",
      bloodType: "B+", 
      allergies: "Sulfa drugs"
    },
    {
      firstName: "Emily",
      lastName: "Williams",
      dateOfBirth: "1988-04-12T00:00:00Z",
      gender: "Female",
      contactNumber: "555-3456",
      email: "emily.w@example.com", 
      address: "321 Cedar Rd, Nowhere, USA",
      bloodType: "AB+",
      allergies: "Latex"
    }
  ],
  
  medicalRecords: [
    {
      diagnosis: "Hypertension",
      symptoms: "Headache, dizziness, chest pain",
      notes: "Patient presented with elevated blood pressure. Recommend lifestyle changes and monitoring.",
      vitalSigns: "BP: 150/95, HR: 88, RR: 16, Temp: 37.1°C",
      treatmentPlan: "1. Prescribed Lisinopril 10mg once daily\n2. Recommended sodium-restricted diet\n3. Daily exercise minimum 30 minutes\n4. Stress reduction techniques discussed",
      followUpDate: "2025-06-15T10:00:00Z"
    },
    {
      diagnosis: "Upper Respiratory Infection",
      symptoms: "Cough, sore throat, congestion",
      notes: "Symptoms present for 5 days. No signs of pneumonia or severe infection.",
      vitalSigns: "BP: 120/80, HR: 76, RR: 18, Temp: 37.8°C",
      treatmentPlan: "1. Rest and adequate hydration\n2. OTC decongestants and pain relievers\n3. Saline nasal spray\n4. Return if symptoms worsen or persist beyond 7 days"
    },
    {
      diagnosis: "Diabetes Mellitus Type 2",
      symptoms: "Polyuria, polydipsia, fatigue",
      notes: "Initial diagnosis. Patient reports family history of diabetes.",
      vitalSigns: "BP: 135/85, HR: 82, RR: 16, Temp: 36.8°C",
      treatmentPlan: "1. Metformin 500mg twice daily\n2. Blood glucose monitoring\n3. Dietary counseling referral\n4. Education on diabetes management provided",
      followUpDate: "2025-06-10T14:00:00Z"
    }
  ],
  
  prescriptions: [
    {
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      notes: "Take in the morning with food",
      expiryDate: "2025-06-15T00:00:00Z"
    },
    {
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "90 days",
      notes: "Take with morning and evening meals",
      expiryDate: "2025-08-15T00:00:00Z"
    },
    {
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      duration: "10 days",
      notes: "Take until complete. Do not stop early even if feeling better.",
      expiryDate: "2025-05-25T00:00:00Z"
    }
  ],
  
  appointments: [
    {
      appointmentDate: "2025-06-15T10:00:00Z",
      status: "SCHEDULED",
      notes: "Follow-up for hypertension"
    },
    {
      appointmentDate: "2025-06-10T14:00:00Z",
      status: "SCHEDULED",
      notes: "Diabetes check-up"
    },
    {
      appointmentDate: "2025-05-02T11:30:00Z",
      status: "COMPLETED",
      notes: "Initial consultation"
    }
  ]
};
