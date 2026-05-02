'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import type { TaskType, TaskPriority } from '@/types'
import { TASK_TYPE_COLORS, PRIORITY_COLORS } from '@/types'

interface AddTaskModalProps {
  projectId: string
  open: boolean
  onClose: () => void
}

const TASK_TYPES: TaskType[] = ['epic', 'feature', 'story', 'task', 'subtask']
const PRIORITIES: TaskPriority[] = ['critical', 'high', 'medium', 'low']

export default function AddTaskModal({ projectId, open, onClose }: AddTaskModalProps) {
  const createTask = useTaskStore((s) => s.createTask)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<TaskType>('task')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  if (!open) return null

  const handleCreate = () => {
    if (!title.trim()) return
    createTask({
      projectId,
      type,
      title: title.trim(),
      status: 'todo',
      priority,
    })
    setTitle('')
    setType('task')
    setPriority('medium')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#F5F5F5]">Create Task</h2>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#F5F5F5] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-[#6B7280] mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-[#F5F5F5] text-sm placeholder:text-[#6B7280] focus:outline-none focus:border-[#F97316]"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm text-[#6B7280] mb-1.5">Type</label>
            <div className="flex flex-wrap gap-2">
              {TASK_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm capitalize border transition-colors ${
                    type === t
                      ? 'border-[#F97316] bg-[#F97316]/10 text-[#F5F5F5]'
                      : 'border-[#2A2A2A] text-[#6B7280] hover:text-[#F5F5F5]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: TASK_TYPE_COLORS[t] }}
                  />
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-[#6B7280] mb-1.5">Priority</label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm capitalize border transition-colors ${
                    priority === p
                      ? 'border-[#F97316] bg-[#F97316]/10 text-[#F5F5F5]'
                      : 'border-[#2A2A2A] text-[#6B7280] hover:text-[#F5F5F5]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[p] }}
                  />
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-medium hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}
