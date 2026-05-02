/**
 * Task calendar sync endpoint
 * Creates or updates calendar events when tasks are modified
 * Called from frontend when task is created/updated with due date
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getGoogleToken,
  isTokenExpired,
  updateAccessToken,
} from '@/lib/firebase-calendar'
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  refreshAccessToken,
} from '@/lib/google-calendar'

export async function POST(request: NextRequest) {
  try {
    const { userId, action, task, googleEventId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get stored Google token
    const tokenData = await getGoogleToken(userId)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 401 }
      )
    }

    let accessToken = tokenData.accessToken

    // Refresh token if expired
    if (isTokenExpired(tokenData) && tokenData.refreshToken) {
      try {
        const { accessToken: newToken, expiresIn } = await refreshAccessToken(
          tokenData.refreshToken
        )
        accessToken = newToken
        await updateAccessToken(userId, newToken, expiresIn)
      } catch (error) {
        console.error('Token refresh failed:', error)
        return NextResponse.json(
          { error: 'Failed to refresh calendar token' },
          { status: 401 }
        )
      }
    }

    let eventId = googleEventId

    switch (action) {
      case 'create': {
        if (!task.dueDate) {
          return NextResponse.json(
            { error: 'Task must have a due date' },
            { status: 400 }
          )
        }

        // Calculate end time (1 hour after start or full day if no time)
        const startDateTime = new Date(task.dueDate)
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

        eventId = await createCalendarEvent(accessToken, {
          title: task.title,
          description: task.description,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          taskId: task.id,
        })

        return NextResponse.json({ eventId, action: 'created' })
      }

      case 'update': {
        if (!googleEventId) {
          return NextResponse.json(
            { error: 'Event ID is required for update' },
            { status: 400 }
          )
        }

        if (!task.dueDate) {
          // If due date is removed, delete the event
          await deleteCalendarEvent(accessToken, googleEventId)
          return NextResponse.json({ action: 'deleted' })
        }

        const startDateTime = new Date(task.dueDate)
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

        await updateCalendarEvent(accessToken, googleEventId, {
          title: task.title,
          description: task.description,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          taskId: task.id,
        })

        return NextResponse.json({ action: 'updated' })
      }

      case 'delete': {
        if (!googleEventId) {
          return NextResponse.json(
            { error: 'Event ID is required for delete' },
            { status: 400 }
          )
        }

        await deleteCalendarEvent(accessToken, googleEventId)
        return NextResponse.json({ action: 'deleted' })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    )
  }
}
