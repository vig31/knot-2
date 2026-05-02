# Google Calendar Integration Guide

## Overview

This document explains how to set up and use the Google Calendar integration in Knot.

## Features

- **One-way sync**: Task due dates automatically sync to Google Calendar
- **User-level**: Each user manages their own calendar connection
- **Automatic**: Events are created/updated/deleted automatically when tasks change
- **Secure**: Tokens are encrypted and stored in Firebase

## Setup Instructions

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it something like "Knot Calendar")
3. Enable the **Google Calendar API**:
   - Search for "Google Calendar API"
   - Click Enable

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/google-calendar/callback  (development)
   https://yourdomain.com/api/auth/google-calendar/callback  (production)
   ```
5. Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your_client_id>
GOOGLE_CLIENT_SECRET=<your_client_secret>
NEXT_PUBLIC_GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/auth/google-calendar/callback
```

For production, update the redirect URI to your domain.

### 4. Firestore Setup

The integration automatically stores tokens in a `googleCalendarTokens` collection in Firestore. Make sure your Firestore Security Rules allow users to manage their own tokens:

```javascript
// In Firestore Security Rules
match /googleCalendarTokens/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

## Usage

### For Users

1. Go to **Settings** → **Calendar Integration**
2. Click **Connect Google Calendar**
3. Sign in with your Google account
4. Grant Knot permission to manage calendar events
5. Once connected, all tasks with due dates will sync automatically

### For Developers

#### Syncing a Task to Calendar

```typescript
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'

export function TaskComponent({ task, userId }) {
  const { syncTaskToCalendar } = useGoogleCalendar()

  const handleCreateTask = async () => {
    try {
      // When creating a task with a due date
      const eventId = await syncTaskToCalendar(userId, task, 'create')
      // Store eventId with the task
    } catch (error) {
      console.error('Failed to sync:', error)
    }
  }

  const handleUpdateTask = async () => {
    try {
      // When updating a task
      await syncTaskToCalendar(userId, task, 'update', googleEventId)
    } catch (error) {
      console.error('Failed to sync:', error)
    }
  }

  return (
    // Your JSX
  )
}
```

#### Syncing a Task Deletion

```typescript
const handleDeleteTask = async () => {
  try {
    // When deleting a task
    await syncTaskToCalendar(userId, task, 'delete', googleEventId)
  } catch (error) {
    console.error('Failed to sync:', error)
  }
}
```

## API Endpoints

### POST `/api/auth/google-calendar/callback`

Handles OAuth callback from Google.

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: Base64-encoded state object with userId and redirectUrl
- `error`: Error message if authorization failed

### POST `/api/tasks/sync-calendar`

Syncs task changes to Google Calendar.

**Request Body:**
```json
{
  "userId": "firebase_user_id",
  "action": "create" | "update" | "delete",
  "task": {
    "id": "task_id",
    "title": "Task title",
    "description": "Optional description",
    "dueDate": "2026-05-15T10:00:00Z"
  },
  "googleEventId": "google_calendar_event_id" // Required for update/delete
}
```

**Response:**
```json
{
  "eventId": "google_calendar_event_id",
  "action": "created" | "updated" | "deleted"
}
```

## Data Storage

### Firestore Collection: `googleCalendarTokens`

```
{
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  connectedAt: timestamp,
  updatedAt: timestamp
}
```

### Firestore Collection: `tasks`

Add these optional fields to track calendar sync:

```
{
  // ... existing task fields
  googleEventId?: string,
  syncedToCalendar?: boolean,
  lastCalendarSync?: timestamp
}
```

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `GOOGLE_CLIENT_SECRET not found` | Missing env variable | Add to `.env.local` |
| `Failed to exchange code` | Redirect URI mismatch | Verify redirect URI in GCP Console |
| `Google Calendar not connected` | User hasn't connected | Show "Connect Calendar" UI |
| `Failed to refresh access token` | Token expired or revoked | Require user to reconnect |

## Token Management

- **Access tokens** expire after 1 hour
- **Refresh tokens** are long-lived and stored securely
- Tokens are automatically refreshed when needed
- If refresh fails, user must reconnect from Settings

## Scopes

The integration requests minimal permissions:

- `https://www.googleapis.com/auth/calendar` — Create/modify events
- `https://www.googleapis.com/auth/userinfo.email` — Get user email

No calendar reading or sharing features.

## Testing

### Local Testing

1. Set up `.env.local` with test credentials
2. Run `npm run dev`
3. Navigate to `/settings/calendar`
4. Click "Connect Google Calendar"
5. Sign in with a test Google account
6. Create a task with a due date
7. Verify event appears in Google Calendar

### Mock Testing

For testing without Google account:

```typescript
// Mock the sync function in tests
jest.mock('@/hooks/useGoogleCalendar', () => ({
  useGoogleCalendar: () => ({
    syncTaskToCalendar: jest.fn().mockResolvedValue('mock_event_id'),
    connectCalendar: jest.fn(),
    isConnecting: false,
    isLoading: false,
    error: null,
  }),
}))
```

## Security Considerations

1. **Token Storage**: Tokens are stored in Firestore with user isolation
2. **HTTPS Only**: OAuth redirect must use HTTPS in production
3. **Scope Limitation**: Only calendar write permission is requested
4. **Token Expiry**: Access tokens expire after 1 hour for security
5. **User Consent**: Users explicitly connect their calendar

## Future Enhancements

- [ ] Bidirectional sync (calendar events → tasks)
- [ ] Calendar event visualization in Knot
- [ ] Project-level calendar views
- [ ] Multiple calendar support
- [ ] Calendar event reminders
- [ ] Integration with task status changes

## Support

For issues or questions:
1. Check the [Google Calendar API documentation](https://developers.google.com/calendar/api/guides/overview)
2. Review Firestore Security Rules
3. Check browser console for detailed error messages
4. Verify OAuth credentials in GCP Console
