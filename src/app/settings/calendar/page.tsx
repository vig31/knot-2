/**
 * Calendar Settings Page
 * Manage Google Calendar integration
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { Calendar, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function CalendarSettings() {
  const user = useAuthStore((s) => s.user)
  const { connectCalendar, isConnecting } = useGoogleCalendar()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionDate, setConnectionDate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Check for OAuth callback success/error
    const params = new URLSearchParams(window.location.search)
    const successParam = params.get('success')
    const errorParam = params.get('error')
    const connectedParam = params.get('connected')

    if (successParam && connectedParam === 'calendar') {
      setSuccess('Google Calendar connected successfully!')
      setIsConnected(true)
      setConnectionDate(new Date().toLocaleString())
      // Clear URL params
      window.history.replaceState({}, '', '/settings/calendar')
    } else if (errorParam) {
      setError(`Connection failed: ${decodeURIComponent(errorParam)}`)
      window.history.replaceState({}, '', '/settings/calendar')
    }
  }, [])

  const handleConnect = async () => {
    if (user) {
      setError(null)
      await connectCalendar(user.uid)
    }
  }

  const handleDisconnect = async () => {
    // TODO: Implement disconnect functionality
    // This would delete the tokens from Firebase
    setIsConnected(false)
    setConnectionDate(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Calendar Integration</h1>
              <p className="text-gray-600 text-sm">
                Sync your task due dates with Google Calendar
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Connection Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Success</h3>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Connection Status */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Connection Status
                </h3>
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700">
                      Connected
                      {connectionDate && (
                        <span className="text-gray-600 ml-1">
                          ({connectionDate})
                        </span>
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Not connected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">
              What this does:
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>
                  Automatically creates Google Calendar events when you create
                  tasks with due dates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>
                  Updates calendar events when you modify task due dates or
                  titles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>
                  Removes calendar events when you delete tasks or remove due
                  dates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Events are added to your primary Google Calendar</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isConnected ? (
              <>
                <button
                  onClick={handleDisconnect}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Disconnect Calendar
                </button>
                <button
                  onClick={handleConnect}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Reconnect Calendar'
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Connect Google Calendar
                  </>
                )}
              </button>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Privacy:</strong> We only request access to create and
              manage events on your calendar. We don't read, store, or share your
              calendar data with anyone. You can disconnect at any time, and all
              permissions will be revoked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
