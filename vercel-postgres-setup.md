# Vercel Postgres Setup for Hospital Management System

## Quick Setup Steps:

1. **Go to Vercel Dashboard** → Your Project → Storage tab
2. **Click "Create Database"** → Select "Postgres" 
3. **Accept default settings** and create the database
4. **Copy the connection string** from the dashboard
5. **Update Environment Variables** in Vercel:
   - Replace `DATABASE_URL` with the Postgres connection string
6. **Redeploy** the application

## Alternative: Neon Database (Free Postgres)

If you prefer external Postgres:

1. Go to https://neon.tech
2. Create free account and database
3. Copy connection string 
4. Update `DATABASE_URL` in Vercel environment variables

## After Database Setup:

The application will automatically run migrations and seed data on first deployment.

Default login credentials will be:
- Email: doctor@example.com  
- Password: password123
