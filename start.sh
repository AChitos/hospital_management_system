#!/bin/bash

# Reset database and seed it with initial data
echo "Setting up database..."
npx prisma db push
npm run seed

# Start the development server
echo "Starting development server..."
npm run dev
