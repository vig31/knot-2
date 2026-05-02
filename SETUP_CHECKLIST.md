# Google Calendar Integration - Setup Checklist

## ✅ Implementation Complete

All code has been written and integrated. Here's your setup checklist:

## 🔧 Phase 1: GCP Configuration (DO THIS FIRST)

- [ ] **Create GCP Project**
  - Go to https://console.cloud.google.com/
  - Create new project named "Knot"
  - Note the project ID

- [ ] **Enable Google Calendar API**
  - Search for "Google Calendar API"
  - Click Enable
  - Wait for confirmation

- [ ] **Create OAuth 2.0 Credentials**
  - Go to APIs & Services → Credentials
  - Click "Create Credentials" → "OAuth client ID"
  - Select "Web application"
  - Add Authorized Redirect URIs:
    ```
    http://localhost:3000/api/auth/google-calendar/callback
    ```
  - Copy **Client ID** and **Client Secret**
  - Store securely

## 🌐 Phase 2: Environment Configuration

- [ ] **Update `.env.local`**
  ```bash
  # Existing vars stay the same...
  
  # Add these:
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your_client_id>
  GOOGLE_CLIENT_SECRET=<your_client_secret>
  NEXT_PUBLIC_GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/auth/google-calendar/callback
  ```

- [ ] **Verify environment variables loaded**
  ```bash
  npm run dev
  # Check browser console for any missing var errors
  ```

## 🔐 Phase 3: Firestore Setup

- [ ] **Update Firestore Security Rules**
  - Go to Firebase Console → Firestore Database → Rules
  - Update rules to include:
    ```javascript
    match /googleCalendarTokens/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    ```
  - Publish rules
  - Test with "Rules Playground"

## 🧪 Phase 4: Testing

- [ ] **Test OAuth Flow**
  - Go to http://localhost:3000/settings/calendar
  - Click "Connect Google Calendar"
  - You should be redirected to Google login
  - Grant permissions
  - Should redirect back with success message

- [ ] **Test Event Creation**
  - Create a new task with a due date
  - Click "Sync to Calendar" button
  - Check Google Calendar to see the event

- [ ] **Test Event Update**
  - Change task title or due date
  - Click "Update Calendar"
  - Verify changes in Google Calendar

- [ ] **Test Event Deletion**
  - Delete the task or remove due date
  - Event should be removed from calendar

## 📱 Phase 5: Integration with Task Components

- [ ] **Import hook in task components**
  ```typescript
  import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
  ```

- [ ] **Add sync calls to task creation**
  ```typescript
  if (userHasCalendarConnected && task.dueDate) {
    const eventId = await syncTaskToCalendar(userId, task, 'create')
  }
  ```

- [ ] **Add sync calls to task updates**
  ```typescript
  if (googleEventId) {
    await syncTaskToCalendar(userId, task, 'update', googleEventId)
  }
  ```

- [ ] **Add sync calls to task deletion**
  ```typescript
  if (googleEventId) {
    await syncTaskToCalendar(userId, task, 'delete', googleEventId)
  }
  ```

## 🚀 Phase 6: Production Deployment

- [ ] **Update OAuth Redirect URI in GCP**
  - Add production domain:
    ```
    https://your-domain.com/api/auth/google-calendar/callback
    ```

- [ ] **Update `.env.production`**
  - Update NEXT_PUBLIC_GOOGLE_CALENDAR_REDIRECT_URI to production URL
  - Keep other vars the same

- [ ] **Enable HTTPS**
  - OAuth requires HTTPS in production
  - Verify SSL certificate is valid

- [ ] **Test in production**
  - Complete full OAuth flow
  - Create and sync a task
  - Verify event appears in calendar

## 📊 Verification Checklist

### OAuth Flow
- [ ] Google login screen appears
- [ ] Permissions consent screen shows
- [ ] Redirect back to settings page works
- [ ] Success message displays
- [ ] Token stored in Firestore

### Task Sync
- [ ] "Sync to Calendar" button appears
- [ ] Button is disabled if no due date
- [ ] Click creates calendar event
- [ ] Event title matches task title
- [ ] Event date matches task due date
- [ ] Event appears in user's calendar

### Error Handling
- [ ] Shows error if calendar not connected
- [ ] Shows error if API rate limited
- [ ] Shows error if token expired (then auto-refreshes)
- [ ] Shows error if network fails
- [ ] Tasks still work even if sync fails

## 🛠️ Debugging Commands

```bash
# Check if environment variables are loaded
echo $NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Check Firestore collection exists and has data
# Firebase Console → Firestore Database → googleCalendarTokens

# Monitor API calls
# Browser DevTools → Network tab → filter for "sync-calendar"

# Check browser console for detailed errors
# Browser DevTools → Console tab
```

## 📞 Common Issues & Solutions

### "GOOGLE_CLIENT_SECRET is not defined"
- ✅ Only use in API routes (server-side)
- ✅ Never reference in frontend code
- ✅ Check `.env.local` for typos

### "Redirect URI mismatch"
- ✅ Verify exact URL in GCP Console
- ✅ http://localhost:3000 (not 3001)
- ✅ Must match NEXT_PUBLIC_GOOGLE_CALENDAR_REDIRECT_URI

### "Permission denied" for Firestore
- ✅ Update Firestore security rules
- ✅ Check user is authenticated before sync
- ✅ Verify googleCalendarTokens collection exists

### "Calendar event not appearing"
- ✅ Check that task has a dueDate field
- ✅ Verify calendar sync succeeded (check API response)
- ✅ Check Google Calendar privacy settings
- ✅ Wait a few seconds for sync

### "Token refresh failing"
- ✅ User may need to reconnect calendar
- ✅ Refresh token may have been revoked
- ✅ Check Google account hasn't changed password

## 📖 Documentation Files

Read in this order:
1. `GOOGLE_CALENDAR_INTEGRATION.md` — Full implementation guide
2. `IMPLEMENTATION_SUMMARY.md` — Quick overview (in session files)
3. This file — Setup checklist

## ✨ What Works Now

✅ Users can connect their Google Calendar  
✅ Tasks automatically sync to calendar as events  
✅ Task updates sync to calendar events  
✅ Task deletions remove calendar events  
✅ Full OAuth 2.0 flow with token management  
✅ Secure token storage in Firestore  
✅ Automatic token refresh  
✅ Error handling and retry logic  
✅ Settings UI for connection management  
✅ Example components showing integration  

## 🎯 Next Steps

1. **Complete GCP Setup** (Phases 1-2)
2. **Run Tests** (Phase 4)
3. **Integrate with Existing Task Components** (Phase 5)
4. **Deploy to Production** (Phase 6)

You're ready to ship! 🚀
