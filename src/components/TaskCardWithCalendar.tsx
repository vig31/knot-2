/**
 * Example: Task Component with Calendar Sync
 * Shows how to integrate Google Calendar syncing into task components
 */

'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { Calendar, AlertCircle } from 'lucide-react'

interface TaskCardProps {
  task: Task
  userId: string
  onUpdate?: (task: Task) => void
}

export function TaskCardWithCalendar({ task, userId, onUpdate }: TaskCardProps) {
  const { syncTaskToCalendar, isLoading, error } = useGoogleCalendar()
  const [googleEventId, setGoogleEventId] = useState<string | undefined>()
  const [isSyncedToCalendar, setIsSyncedToCalendar] = useState(false)

  const handleSyncTask = async () => {
    try {
      if (!task.dueDate) {
        alert('Please set a due date before syncing to calendar')
        return
      }

      // Create or update calendar event
      const eventId = await syncTaskToCalendar(
        userId,
        task,
        googleEventId ? 'update' : 'create',
        googleEventId
      )

      setGoogleEventId(eventId)
      setIsSyncedToCalendar(true)

      // Optional: Update task metadata
      if (onUpdate) {
        onUpdate({
          ...task,
          // Store the Google event ID with the task for future reference
        })
      }
    } catch (err) {
      console.error('Failed to sync task to calendar:', err)
    }
  }

  const handleRemoveFromCalendar = async () => {
    if (!googleEventId) return

    try {
      await syncTaskToCalendar(userId, task, 'delete', googleEventId)
      setGoogleEventId(undefined)
      setIsSyncedToCalendar(false)
    } catch (err) {
      console.error('Failed to remove task from calendar:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
      </div>

      {/* Task Metadata */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        {task.dueDate && (
          <div>
            <span className="text-gray-500">Due Date:</span>
            <p className="font-medium text-gray-900">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        )}
        {task.assigneeId && (
          <div>
            <span className="text-gray-500">Assigned To:</span>
            <p className="font-medium text-gray-900">{task.assigneeId}</p>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Calendar Sync Status */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          {isSyncedToCalendar ? (
            <span className="text-green-700">
              ✓ Synced to Google Calendar
            </span>
          ) : (
            <span className="text-gray-600">Not synced to calendar</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!isSyncedToCalendar ? (
          <button
            onClick={handleSyncTask}
            disabled={isLoading || !task.dueDate}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? '...' : <Calendar className="w-4 h-4" />}
            {isLoading ? 'Syncing...' : 'Sync to Calendar'}
          </button>
        ) : (
          <>
            <button
              onClick={handleSyncTask}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 transition-colors text-sm font-medium"
            >
              {isLoading ? 'Updating...' : 'Update Calendar'}
            </button>
            <button
              onClick={handleRemoveFromCalendar}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 transition-colors text-sm font-medium"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Usage Example:
 *
 * <TaskCardWithCalendar
 *   task={task}
 *   userId={currentUser.uid}
 *   onUpdate={(updatedTask) => {
 *     // Handle task update
 *   }}
 * />
 */
