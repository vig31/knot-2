/**
 * Hook for Google Calendar integration
 */

import { useState, useCallback } from 'react'
import { getGoogleAuthUrl } from '@/lib/google-calendar'
import { Task } from '@/types'

export function useGoogleCalendar() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectCalendar = useCallback(async (userId: string) => {
    setIsConnecting(true)
    setError(null)

    try {
      const redirectUri =
        process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_REDIRECT_URI!

      // Create state with userId and redirect URL
      const state = Buffer.from(
        JSON.stringify({
          userId,
          redirectUrl: '/settings/calendar',
        })
      ).toString('base64')

      // Get authorization URL
      const authUrl = getGoogleAuthUrl(redirectUri)
      const urlWithState = `${authUrl}&state=${state}`

      // Redirect to Google OAuth
      window.location.href = urlWithState
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect calendar'
      setError(message)
      setIsConnecting(false)
    }
  }, [])

  const syncTaskToCalendar = useCallback(
    async (
      userId: string,
      task: Task,
      action: 'create' | 'update' | 'delete',
      googleEventId?: string
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/tasks/sync-calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            action,
            task,
            googleEventId,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Sync failed')
        }

        const data = await response.json()
        return data.eventId || data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Sync failed'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    connectCalendar,
    syncTaskToCalendar,
    isConnecting,
    isLoading,
    error,
  }
}
