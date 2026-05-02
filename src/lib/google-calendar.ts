/**
 * Google Calendar API Integration
 * Handles OAuth 2.0 flow and calendar event management
 */

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email',
]

/**
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<{
  accessToken: string
  refreshToken?: string
  expiresIn: number
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to exchange code: ${error.error_description}`)
  }

  const data = await response.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{
  accessToken: string
  expiresIn: number
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh access token')
  }

  const data = await response.json()
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  }
}

/**
 * Create a calendar event
 */
export async function createCalendarEvent(
  accessToken: string,
  eventData: {
    title: string
    description?: string
    startDateTime: string
    endDateTime: string
    taskId: string
  }
): Promise<string> {
  const event = {
    summary: eventData.title,
    description: eventData.description || `Task ID: ${eventData.taskId}`,
    start: {
      dateTime: eventData.startDateTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: eventData.endDateTime,
      timeZone: 'UTC',
    },
    extendedProperties: {
      private: {
        taskId: eventData.taskId,
      },
    },
  }

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to create calendar event: ${error.error.message}`)
  }

  const data = await response.json()
  return data.id
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  eventData: {
    title: string
    description?: string
    startDateTime: string
    endDateTime: string
    taskId: string
  }
): Promise<void> {
  const event = {
    summary: eventData.title,
    description: eventData.description || `Task ID: ${eventData.taskId}`,
    start: {
      dateTime: eventData.startDateTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: eventData.endDateTime,
      timeZone: 'UTC',
    },
    extendedProperties: {
      private: {
        taskId: eventData.taskId,
      },
    },
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to update calendar event: ${error.error.message}`)
  }
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to delete calendar event: ${error.error.message}`)
  }
}

/**
 * Get user's primary calendar
 */
export async function getPrimaryCalendar(accessToken: string): Promise<string> {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get primary calendar')
  }

  const data = await response.json()
  return data.id
}
