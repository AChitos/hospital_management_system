# Vercel Postgres Setup for Hospital Management System

## Choose Your Database Option:

### Option 1: Vercel Postgres
- ✅ Integrated with Vercel dashboard
- ✅ No separate account needed
- ❌ More expensive ($20/month after free tier)
- ❌ Smaller free tier (256MB)

### Option 2: Neon Database (RECOMMENDED)
- ✅ Generous free tier (512MB)
- ✅ Excellent performance 
- ✅ Better for production apps
- ❌ Requires separate account

---

## Quick Setup Steps (Vercel Postgres):

1. **Go to Vercel Dashboard** → Your Project → Storage tab
2. **Click "Create Database"** → Select "Postgres" 
3. **Accept default settings** and create the database
4. **Copy the connection string** from the dashboard
5. **Update Environment Variables** in Vercel:
   - Replace `DATABASE_URL` with the Postgres connection string
6. **Redeploy** the application

## Alternative: Neon Database (Free Postgres) - RECOMMENDED

Neon offers a generous free tier with 512MB storage, perfect for this application:

### Step-by-Step Neon Setup:

1. **Create Account**
   - Go to https://neon.tech
   - Sign up with GitHub, Google, or email
   - Verify your email if needed

2. **Create Database**
   - Click "Create Project" 
   - Choose a project name (e.g., "hospital-management")
   - Select region closest to your users
   - Leave Postgres version as default (latest)
   - Click "Create Project"

3. **Get Connection String**
   - After creation, you'll see the connection details
   - Copy the "Connection string" (starts with `postgresql://`)
   - It will look like: `postgresql://username:password@host/database?sslmode=require`

4. **Update Vercel Environment Variables**
   - Go to your Vercel Dashboard → Your Project → Settings → Environment Variables
   - Find the `DATABASE_URL` variable
   - Replace its value with the Neon connection string
   - Click "Save"

5. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger deployment

## After Database Setup:

The application will automatically run migrations and seed data on first deployment.

### What Happens During First Deployment:
1. Prisma detects the new database is empty
2. Runs all migrations to create tables
3. Executes the seed script to create initial data
4. Creates the default doctor account

### Default Login Credentials:
- **Email:** doctor@example.com  
- **Password:** password123

### Troubleshooting:

**If you see "Database not found" errors:**
- Verify the connection string is correct in Vercel environment variables
- Ensure the connection string includes `?sslmode=require` at the end
- Check that the database exists in your Neon dashboard

**If migrations fail:**
- Check the deployment logs in Vercel for specific error messages
- Ensure the database user has CREATE privileges
- Try manually running migrations locally first: `npx prisma migrate deploy`

**If seed data isn't created:**
- Check if the seed script ran in deployment logs
- The application will create the default user on first API call if seeding failed

### Neon Database Benefits:
- ✅ 512MB storage (free tier)
- ✅ Always-on availability  
- ✅ Automatic backups
- ✅ Built-in connection pooling
- ✅ Scale to zero when not in use
