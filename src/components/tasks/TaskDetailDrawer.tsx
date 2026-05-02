'use client'

import { X, Trash2 } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { TaskStatus, TaskPriority, TaskType } from '@/types'
import {
  TASK_TYPE_COLORS,
  PRIORITY_COLORS,
  STATUS_COLUMNS,
  STATUS_LABELS,
} from '@/types'

const TASK_TYPES: TaskType[] = ['epic', 'feature', 'story', 'task', 'subtask']
const PRIORITIES: TaskPriority[] = ['critical', 'high', 'medium', 'low']

export default function TaskDetailDrawer() {
  const { tasks, selectedTaskId, selectTask, updateTask, deleteTask, getChildTasks } =
    useTaskStore()
  const members = useAuthStore((s) => s.members)

  if (!selectedTaskId) return null

  const task = tasks[selectedTaskId]
  if (!task) return null

  const children = getChildTasks(task.id)

  const handleDelete = () => {
    deleteTask(task.id)
    selectTask(null)
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-[400px] bg-[#1A1A1A] border-l border-[#2A2A2A] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: TASK_TYPE_COLORS[task.type] }}
          />
          <span className="text-xs uppercase font-medium text-[#6B7280]">
            {task.type}
          </span>
        </div>
        <button
          onClick={() => selectTask(null)}
          className="text-[#6B7280] hover:text-[#F5F5F5] transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Title */}
        <input
          type="text"
          value={task.title}
          onChange={(e) => updateTask(task.id, { title: e.target.value })}
          className="w-full text-lg font-semibold text-[#F5F5F5] bg-transparent border-none outline-none focus:ring-0 placeholder:text-[#6B7280]"
        />

        {/* Status */}
        <div>
          <label className="block text-xs text-[#6B7280] mb-1.5 uppercase tracking-wide">
            Status
          </label>
          <select
            value={task.status}
            onChange={(e) =>
              updateTask(task.id, { status: e.target.value as TaskStatus })
            }
            className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
          >
            {STATUS_COLUMNS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs text-[#6B7280] mb-1.5 uppercase tracking-wide">
            Priority
          </label>
          <select
            value={task.priority}
            onChange={(e) =>
              updateTask(task.id, { priority: e.target.value as TaskPriority })
            }
            className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs text-[#6B7280] mb-1.5 uppercase tracking-wide">
            Type
          </label>
          <select
            value={task.type}
            onChange={(e) =>
              updateTask(task.id, { type: e.target.value as TaskType })
            }
            className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
          >
            {TASK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-xs text-[#6B7280] mb-1.5 uppercase tracking-wide">
            Assignee
          </label>
          <select
            value={task.assigneeId ?? ''}
            onChange={(e) =>
              updateTask(task.id, {
                assigneeId: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.uid} value={m.uid}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs text-[#6B7280] mb-1.5 uppercase tracking-wide">
            Due Date
          </label>
          <input
            type="date"
            value={task.dueDate ?? ''}
            onChange={(e) =>
              updateTask(task.id, { dueDate: e.target.value || undefined })
            }
            className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-[#6B7280] mb-1.5 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={task.description ?? ''}
            onChange={(e) =>
              updateTask(task.id, { description: e.target.value || undefined })
            }
            rows={4}
            placeholder="Add a description..."
            className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F5] placeholder:text-[#6B7280] focus:outline-none focus:border-[#F97316] resize-none"
          />
        </div>

        {/* Child tasks */}
        {children.length > 0 && (
          <div>
            <label className="block text-xs text-[#6B7280] mb-2 uppercase tracking-wide">
              Child Tasks ({children.length})
            </label>
            <div className="space-y-1">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => selectTask(child.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-left hover:border-[#3A3A3A] transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: TASK_TYPE_COLORS[child.type] }}
                  />
                  <span className="text-sm text-[#F5F5F5] truncate">
                    {child.title}
                  </span>
                  <span className="ml-auto text-xs text-[#6B7280] capitalize">
                    {STATUS_LABELS[child.status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Delete */}
      <div className="px-5 py-4 border-t border-[#2A2A2A]">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors w-full justify-center"
        >
          <Trash2 size={16} />
          Delete Task
        </button>
      </div>
    </div>
  )
}
