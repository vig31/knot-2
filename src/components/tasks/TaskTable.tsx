'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { TASK_TYPE_COLORS, PRIORITY_COLORS, STATUS_LABELS } from '@/types'

type SortField = 'type' | 'title' | 'status' | 'priority' | 'assignee' | 'dueDate'
type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const STATUS_ORDER: Record<TaskStatus, number> = {
  backlog: 0,
  todo: 1,
  in_progress: 2,
  in_review: 3,
  done: 4,
}

export default function TaskTable({ projectId }: { projectId: string }) {
  const { tasks, selectTask } = useTaskStore()
  const members = useAuthStore((s) => s.members)
  const [sortField, setSortField] = useState<SortField>('priority')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const projectTasks = useMemo(
    () => Object.values(tasks).filter((t) => t.projectId === projectId),
    [tasks, projectId]
  )

  const memberMap = useMemo(
    () => Object.fromEntries(members.map((m) => [m.uid, m])),
    [members]
  )

  const sorted = useMemo(() => {
    const arr = [...projectTasks]
    const dir = sortDir === 'asc' ? 1 : -1

    arr.sort((a, b) => {
      switch (sortField) {
        case 'type':
          return dir * a.type.localeCompare(b.type)
        case 'title':
          return dir * a.title.localeCompare(b.title)
        case 'status':
          return dir * (STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
        case 'priority':
          return dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
        case 'assignee': {
          const nameA = a.assigneeId ? (memberMap[a.assigneeId]?.name ?? '') : ''
          const nameB = b.assigneeId ? (memberMap[b.assigneeId]?.name ?? '') : ''
          return dir * nameA.localeCompare(nameB)
        }
        case 'dueDate': {
          const da = a.dueDate ?? ''
          const db = b.dueDate ?? ''
          return dir * da.localeCompare(db)
        }
        default:
          return 0
      }
    })
    return arr
  }, [projectTasks, sortField, sortDir, memberMap])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown size={12} aria-hidden="true" className="text-[#6B7280]" />
    return sortDir === 'asc' ? (
      <ArrowUp size={12} aria-hidden="true" className="text-[#F97316]" />
    ) : (
      <ArrowDown size={12} aria-hidden="true" className="text-[#F97316]" />
    )
  }

  const columns: { key: SortField; label: string; className?: string }[] = [
    { key: 'type', label: 'Type', className: 'w-24' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status', className: 'w-32' },
    { key: 'priority', label: 'Priority', className: 'w-28' },
    { key: 'assignee', label: 'Assignee', className: 'w-36' },
    { key: 'dueDate', label: 'Due Date', className: 'w-28' },
  ]

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#2A2A2A]">
      <table className="w-full" aria-label="Tasks">
        <thead>
          <tr className="bg-[#1A1A1A]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                aria-sort={
                  sortField === col.key
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                tabIndex={0}
                className={`px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide cursor-pointer hover:text-[#F5F5F5] select-none ${col.className ?? ''}`}
                onClick={() => toggleSort(col.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleSort(col.key)
                  }
                }}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  <SortIcon field={col.key} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((task, i) => (
            <TaskRow
              key={task.id}
              task={task}
              assignee={task.assigneeId ? memberMap[task.assigneeId] : undefined}
              odd={i % 2 === 1}
              onClick={() => selectTask(task.id)}
            />
          ))}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-sm text-[#6B7280]"
              >
                No tasks in this project yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function TaskRow({
  task,
  assignee,
  odd,
  onClick,
}: {
  task: Task
  assignee?: { uid: string; name: string }
  odd: boolean
  onClick: () => void
}) {
  const initials = assignee
    ? assignee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : null

  return (
    <tr
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      className={`border-b border-[#2A2A2A] cursor-pointer hover:bg-[#1A1A1A] transition-colors ${
        odd ? 'bg-[#131313]' : 'bg-[#0F0F0F]'
      }`}
    >
      {/* Type */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: TASK_TYPE_COLORS[task.type] }}
          />
          <span className="text-xs text-[#6B7280] capitalize">{task.type}</span>
        </div>
      </td>

      {/* Title */}
      <td className="px-4 py-3">
        <span className="text-sm text-[#F5F5F5]">{task.title}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={task.status} />
      </td>

      {/* Priority */}
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize"
          style={{
            backgroundColor: PRIORITY_COLORS[task.priority] + '20',
            color: PRIORITY_COLORS[task.priority],
          }}
        >
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
          />
          {task.priority}
        </span>
      </td>

      {/* Assignee */}
      <td className="px-4 py-3">
        {initials ? (
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="w-6 h-6 rounded-full bg-[#F97316]/30 flex items-center justify-center text-[10px] font-medium text-[#F97316]"
            >
              {initials}
            </div>
            <span className="text-sm text-[#6B7280]">{assignee?.name}</span>
          </div>
        ) : (
          <span className="text-xs text-[#6B7280]">—</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-3">
        <span className="text-xs text-[#6B7280]">
          {task.dueDate ?? '—'}
        </span>
      </td>
    </tr>
  )
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const colors: Record<TaskStatus, string> = {
    backlog: '#6B7280',
    todo: '#3B82F6',
    in_progress: '#F97316',
    in_review: '#EAB308',
    done: '#22C55E',
  }
  const color = colors[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: color + '20',
        color,
      }}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {STATUS_LABELS[status]}
    </span>
  )
}
