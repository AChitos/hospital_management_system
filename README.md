This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up the database:

```bash
# Install dependencies
npm install

# Set up the database with initial migrations
npx prisma migrate dev

# Seed the database with initial data
npm run seed
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database Access & Management

This project uses [Prisma](https://prisma.io) with a SQLite database for data management. Here's how to work with it:

### Database Setup

1. The database connection URL is defined in your .env file. Create one if it doesn't exist:

```bash
# Create .env file with database connection
echo "DATABASE_URL=file:../prisma/dev.db" > .env
```

2. Run database migrations to set up your schema:

```bash
npx prisma migrate dev
```

3. Seed the database with initial data (creates a default doctor account):

```bash
npm run seed
```

### Accessing the Database

#### Using Prisma Studio

Prisma provides a GUI tool to view and edit your database:

```bash
npx prisma studio
```

This will open a browser window at http://localhost:5555 where you can browse and manage all data.

#### Programmatic Access

Within the application, use the singleton database client from `/src/lib/utils/db.ts`:

```typescript
import { db } from '@/lib/utils/db';

// Example: Get all patients
const patients = await db.patient.findMany();
```
```

### Reset Database

If you need to completely reset your database:

```bash
npm run db:reset
```

This will reset all data, reapply migrations, and seed with fresh data.

### Default Login Credentials

After seeding the database, you can log in with:
- Email: doctor@example.com
- Password: password123

If you're having trouble logging in, you can reset the default user's password:

```bash
# Run the password reset script
node reset-password.js
```

This will either create the default user if it doesn't exist or reset its password to the one shown above.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# TO do next 
- perioperative anesthesia diagram electronic# Force deployment Wed May 28 16:25:39 CEST 2025
