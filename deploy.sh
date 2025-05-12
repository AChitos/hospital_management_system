#!/bin/bash

# Script to deploy the updated files

# Rename API route files
echo "Updating API routes..."
mv -f "/Users/andreaschitos1/hospital_management_system/src/app/api/appointments/route.ts.new" "/Users/andreaschitos1/hospital_management_system/src/app/api/appointments/route.ts" 
mv -f "/Users/andreaschitos1/hospital_management_system/src/app/api/appointments/[appointmentId]/route.ts.new" "/Users/andreaschitos1/hospital_management_system/src/app/api/appointments/[appointmentId]/route.ts"
mv -f "/Users/andreaschitos1/hospital_management_system/src/app/api/prescriptions/[patientId]/route.ts.new" "/Users/andreaschitos1/hospital_management_system/src/app/api/prescriptions/[patientId]/route.ts"

# Rename updated page files
echo "Updating pages..."
mv -f "/Users/andreaschitos1/hospital_management_system/src/app/appointments/page.tsx.new" "/Users/andreaschitos1/hospital_management_system/src/app/appointments/page.tsx"
mv -f "/Users/andreaschitos1/hospital_management_system/src/app/prescriptions/page.tsx.new" "/Users/andreaschitos1/hospital_management_system/src/app/prescriptions/page.tsx"

echo "Deployment complete!"
