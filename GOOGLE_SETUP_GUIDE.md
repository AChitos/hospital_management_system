# Google Calendar API Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Hospital Management Calendar")
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on "Google Calendar API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. **FIRST: Configure OAuth Consent Screen** (Click "OAuth consent screen" in left sidebar)
   - Choose "External" user type (click "Create")
   - Fill in required fields:
     - App name: "Hospital Management System"
     - User support email: your email
     - Developer contact: your email
   - **Important**: In "Scopes" section, add these scopes:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
   - **Critical**: In "Test users" section, add your email address
   - Save and continue through all steps
   - **Keep the app in "Testing" mode** (don't publish it)

3. **THEN: Create OAuth client ID**
   - Go back to "Credentials" tab
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application" as application type
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
   - Click "Create"
   - Copy the Client ID and Client Secret

## Step 4: Update Environment Variables

Replace the placeholder values in your `.env` file with the actual credentials:

```env
GOOGLE_CLIENT_ID="your_actual_client_id_here"
GOOGLE_CLIENT_SECRET="your_actual_client_secret_here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

## Step 5: Restart Development Server

After updating the `.env` file:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Common Issues:

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches your .env file
- Include the full URL including protocol (http://)

### Error: "invalid_client"
- Check that Client ID and Client Secret are correct
- Ensure there are no extra spaces or quotes

### Error: "access_denied"
- Make sure your email is added as a test user in OAuth consent screen
- Ensure Calendar scope is added

### Error: "unauthorized_client"
- Verify that your application is properly configured in Google Console
- Check that the OAuth consent screen is properly filled out

## Testing:

1. Start your development server
2. Navigate to http://localhost:3000/calendar
3. Click "Connect Google Calendar"
4. You should be redirected to Google's OAuth page
5. Grant permissions and you'll be redirected back to your app



#credentials: Client ID
24441672557-eef5l58oj21k98lt4jiokhredlb263f3.apps.googleusercontent.com

Client secret
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
Creation date
May 24, 2025 at 11:45:02 AM GMT+2