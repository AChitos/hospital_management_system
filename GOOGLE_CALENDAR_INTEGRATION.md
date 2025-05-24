# Google Calendar Integration

This document describes the Google Calendar integration features implemented in the Hospital Management System.

## Features Implemented

### 1. Database Schema Updates
- Extended `User` model with Google Calendar OAuth fields:
  - `googleCalendarId`: Google Calendar ID
  - `googleAccessToken`: OAuth access token (encrypted)
  - `googleRefreshToken`: OAuth refresh token (encrypted)
  - `googleTokenExpiry`: Token expiration date
- Extended `Appointment` model with:
  - `googleCalendarEventId`: Google Calendar event ID for synced appointments

### 2. Google Calendar Service (`/src/lib/google-calendar.ts`)
- OAuth 2.0 authentication flow
- Calendar event CRUD operations
- Appointment-to-calendar-event conversion
- Token refresh handling
- Multiple calendar support

### 3. ICS Export Service (`/src/lib/ics-export.ts`)
- Generate ICS files for calendar import
- Support for single or multiple appointments
- Filtering by status, date range
- Compatible with all major calendar applications

### 4. API Endpoints

#### Google OAuth Authentication
- `GET /api/auth/google/calendar` - Generate OAuth authorization URL
- `GET /api/auth/google/callback` - Handle OAuth callback

#### Calendar Synchronization
- `POST /api/calendar/sync` - Sync appointment to Google Calendar
- `DELETE /api/calendar/sync` - Remove appointment from Google Calendar

#### Calendar Export
- `GET /api/calendar/export` - Export appointments as ICS file

### 5. User Interface Components

#### Calendar Page (`/src/app/calendar/page.tsx`)
- Interactive calendar view with react-big-calendar
- Month, week, and day views
- Google Calendar connection status
- Appointment statistics dashboard
- Export options (ICS format)
- Click-to-view appointment details

#### Appointment Calendar Component (`/src/components/calendar/AppointmentCalendar.tsx`)
- Color-coded appointments by status
- Interactive appointment selection
- Custom toolbar with navigation
- Event details popup
- Responsive design

#### Updated Appointment Pages
- **Appointment Details**: Google Calendar sync buttons and status indicators
- **New Appointment**: Checkbox to automatically sync to Google Calendar
- **Appointments List**: Calendar view button

### 6. Navigation Updates
- Added "Calendar" link to sidebar navigation
- Added "Calendar View" button to appointments page

## Setup Instructions

### 1. Google Calendar API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

### 2. Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Database Migration
```bash
npx prisma db push
npx prisma generate
```

## Usage Guide

### Connecting Google Calendar
1. Navigate to the Calendar page
2. Click "Connect Google Calendar"
3. Complete OAuth authorization
4. Return to the application

### Syncing Appointments
1. **From Appointment Details**: Click "Sync to Google" button
2. **When Creating**: Check "Sync to Google Calendar" checkbox
3. **Bulk Operations**: Use Calendar page sync options

### Exporting Calendar Data
1. Go to Calendar page
2. Click "Export Calendar"
3. Choose format and filters
4. Download ICS file

### Calendar Views
- **Month View**: Overview of all appointments
- **Week View**: Detailed week schedule
- **Day View**: Hourly appointment slots

## Technical Details

### Dependencies Added
- `googleapis`: Google API client library
- `ics`: ICS file generation
- `react-big-calendar`: Calendar UI component
- `moment`: Date manipulation
- `date-fns`: Date utilities

### Security Considerations
- OAuth tokens are stored securely
- Refresh token rotation supported
- API rate limiting considerations
- Error handling for authentication failures

### Performance Features
- Client-side caching of calendar data
- Optimistic UI updates
- Background sync operations
- Efficient event queries

## Troubleshooting

### Common Issues
1. **OAuth Errors**: Check redirect URI configuration
2. **Sync Failures**: Verify Google Calendar API quota
3. **Token Expiry**: Automatic refresh implemented
4. **Rate Limits**: Built-in retry logic

### Error Handling
- User-friendly error messages
- Graceful degradation when Google Calendar unavailable
- Retry mechanisms for transient failures

## Future Enhancements
- Two-way synchronization (Google → App)
- Multiple calendar support
- Recurring appointment patterns
- Notification settings
- Team calendar sharing
