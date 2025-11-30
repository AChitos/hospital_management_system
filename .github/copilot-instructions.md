# Hospital Management System - AI Coding Agent Instructions

## Architecture Overview

Next.js 15 App Router hospital management system with Prisma + PostgreSQL (dev: SQLite). Doctor manages patients, appointments, prescriptions, and medical records. Google Calendar integration for appointment syncing.

**Key Components:**
- **Auth**: JWT-based, middleware verifies tokens and injects `X-User-ID` header into API routes
- **Database**: Prisma client generated to `src/generated/prisma` (not `@prisma/client`)
- **Client/Server Split**: All pages are `"use client"`, API routes handle server logic
- **State**: Zustand (`authStore`) for auth, persisted to localStorage

## Critical Patterns

### Database Access
```typescript
// Always import from generated location
import { PrismaClient } from '@/generated/prisma';

// Use singleton in API routes (already available in db.ts but routes create new instances)
const prisma = new PrismaClient();
try {
  // ...operations
} finally {
  await prisma.$disconnect(); // Always disconnect
}
```

**Schema Relationships:**
- `User` (doctor) → has many `Patient`, `Prescription`, `MedicalRecord`
- `Patient` → has many `Appointment`, `Prescription`, `MedicalRecord`
- Always filter by `doctorId` to ensure data isolation

### Authentication Flow

**Middleware** (`src/middleware.ts`):
- Verifies JWT using Web Crypto API (Edge Runtime compatible)
- Injects `X-User-ID`, `X-User-Email`, `X-User-Role` headers
- Protects routes: `/api/patients`, `/api/appointments`, `/api/prescriptions`, `/api/medical-records`, `/api/auth/me`, `/api/calendar`, `/api/dashboard`

**API Routes Pattern:**
```typescript
export async function GET(request: NextRequest) {
  const doctorId = request.headers.get('X-User-ID'); // From middleware
  if (!doctorId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  // Use doctorId for queries
}
```

**Client-Side:**
- `useAuthStore` (Zustand) manages token + user state
- `ClientProvider` intercepts all fetch requests to inject `Authorization: Bearer ${token}`
- `apiClient.ts` utility handles headers automatically

### Client vs Server Directives

- **All page components**: `"use client"` (interaction required)
- **API routes**: Implicit server-side, never add `"use client"`
- **Shared utilities**: No directive (works in both contexts)

### Google Calendar Integration

**OAuth Flow:**
1. `GET /api/auth/google/calendar` → generates auth URL
2. User authorizes → redirects to `/api/auth/google/callback`
3. Tokens stored in `User.google*` fields

**Sync Pattern:**
```typescript
// When creating/updating appointments
if (user.googleAccessToken) {
  const gcal = new GoogleCalendarService(user.googleAccessToken, user.googleRefreshToken);
  const eventId = await gcal.createEvent(user.googleCalendarId, event);
  // Store eventId in appointment.googleCalendarEventId
}
```

## Developer Workflows

### Setup
```bash
npm install
npx prisma migrate dev  # Setup database schema
npm run seed            # Creates doctor@example.com / password123
npm run dev             # Start on http://localhost:3000
```

### Database Operations
```bash
npm run db:studio       # Open Prisma Studio (GUI at :5555)
npm run db:migrate      # Create new migration
npm run db:reset        # Nuclear option: reset + reseed
npm run db:verify       # Check database integrity
node reset-password.js  # Reset default user password
```

### Prisma Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push` (dev) or `npx prisma migrate dev` (prod)
3. Run `npx prisma generate` → updates `src/generated/prisma`
4. Restart dev server (postinstall hook runs generate)

### Common Scripts
- `npm run test:profile` - Test profile API
- `node check-appointments.js` - Verify appointments data
- `node test-ics.js` - Test ICS calendar export

## Project-Specific Conventions

### Error Handling
API routes return consistent JSON:
```typescript
{ error: 'Human-readable message' }  // status 400/401/404/500
{ data: result }  // status 200/201
```

### Date Handling
- Store as `DateTime` in Prisma
- Frontend: `date-fns` for formatting, `moment` for calendar operations
- Always convert strings to `Date` objects before Prisma operations: `new Date(appointmentDate)`

### Hydration Warnings
- `reactStrictMode: false` in `next.config.ts` (intentional)
- `suppressHydrationWarning` on `<body>` in `layout.tsx`
- `ClientProvider` suppresses console errors for hydration mismatches (browser extensions cause this)

### File Structure
- **API Routes**: `src/app/api/[resource]/route.ts` (GET, POST) + `[id]/route.ts` (GET, PATCH, DELETE)
- **Pages**: `src/app/[resource]/page.tsx` (list), `[id]/page.tsx` (detail), `new/page.tsx` (create)
- **Components**: `src/components/[category]/ComponentName.tsx`
- **Utilities**: `src/lib/[category]/utilityName.ts`

### UI Components
- Radix UI primitives + custom wrappers in `src/components/ui/`
- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Form validation: `react-hook-form` + `yup`

## Integration Points

### External Services
- **Google Calendar API**: OAuth + event CRUD via `googleapis` package
- **Vercel Analytics**: `@vercel/analytics` and `@vercel/speed-insights` in layout

### Environment Variables
Required in `.env`:
```bash
DATABASE_URL="file:./dev.db"  # SQLite for dev, PostgreSQL for prod
JWT_SECRET="your_secure_secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

### Cross-Component Communication
- **Auth state**: Global via `authStore` (Zustand)
- **API data**: Fetched per-page, no global cache (could add React Query)
- **Navigation**: `useRouter` from `next/navigation` (App Router, not Pages Router)

## Known Quirks

1. **Prisma Import Path**: Always `@/generated/prisma`, NOT `@prisma/client`
2. **Multiple PrismaClient Instances**: Routes create new clients instead of using singleton from `db.ts` (consider refactoring)
3. **Password Reset**: Default user can be recreated with `reset-password.js` if deleted
4. **ESLint Disabled**: `ignoreDuringBuilds: true` in Next config (legacy code cleanup needed)
5. **Duplicate Files**: `*.tsx.new` and `*.ts.new` files exist (WIP features, ignore)

## Examples

**Creating a new API route with auth:**
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

export async function GET(request: NextRequest) {
  const doctorId = request.headers.get('X-User-ID');
  if (!doctorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = new PrismaClient();
  try {
    const data = await prisma.patient.findMany({ where: { doctorId } });
    return NextResponse.json(data);
  } finally {
    await prisma.$disconnect();
  }
}
```

**Client-side API call:**
```typescript
import { api } from '@/lib/utils/apiClient';

const response = await api.get<Patient[]>('/api/patients');
if (response.error) {
  // Handle error
} else {
  // Use response.data
}
```
