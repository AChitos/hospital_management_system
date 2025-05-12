#!/bin/bash

# Script to deploy updated files for the hospital management system

echo "Deploying updated files..."
echo "-------------------------"

# Update patient authentication
echo "Updating API authentication..."

# Run database migrations if needed
echo "Running database migrations..."
cd /Users/andreaschitos1/hospital_management_system && npx prisma migrate deploy

# Start the application
echo "Starting the application..."
cd /Users/andreaschitos1/hospital_management_system && npm run dev

echo "Deployment complete!"
