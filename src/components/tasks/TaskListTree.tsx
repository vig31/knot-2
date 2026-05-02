'use client'

import { useMemo, useState, useCallback } from 'react'
import { ChevronRight, ChevronDown, Calendar } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { Task, TaskStatus } from '@/types'
import { TASK_TYPE_COLORS, STATUS_LABELS } from '@/types'

interface TreeNode {
  task: Task
  children: TreeNode[]
}

function buildTree(tasks: Task[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  const roots: TreeNode[] = []

  tasks.forEach((t) => map.set(t.id, { task: t, children: [] }))

  tasks.forEach((t) => {
    const node = map.get(t.id)!
    if (t.parentId && map.has(t.parentId)) {
      map.get(t.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: '#6B7280',
  todo: '#3B82F6',
  in_progress: '#F97316',
  in_review: '#EAB308',
  done: '#22C55E',
}

export default function TaskListTree({ projectId }: { projectId: string }) {
  const { tasks, selectTask } = useTaskStore()
  const members = useAuthStore((s) => s.members)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const memberMap = useMemo(
    () => Object.fromEntries(members.map((m) => [m.uid, m])),
    [members]
  )

  const projectTasks = useMemo(
    () => Object.values(tasks).filter((t) => t.projectId === projectId),
    [tasks, projectId]
  )

  const tree = useMemo(() => buildTree(projectTasks), [projectTasks])

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <div className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_120px_120px_100px] px-4 py-3 border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          Task
        </span>
        <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          Status
        </span>
        <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          Assignee
        </span>
        <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          Due Date
        </span>
      </div>

      {/* Tree rows */}
      <div>
        {tree.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-[#6B7280]">
            No tasks in this project yet.
          </div>
        )}
        {tree.map((node) => (
          <TreeRow
            key={node.task.id}
            node={node}
            depth={0}
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
            selectTask={selectTask}
            memberMap={memberMap}
          />
        ))}
      </div>
    </div>
  )
}

function TreeRow({
  node,
  depth,
  collapsed,
  toggleCollapse,
  selectTask,
  memberMap,
}: {
  node: TreeNode
  depth: number
  collapsed: Set<string>
  toggleCollapse: (id: string) => void
  selectTask: (id: string) => void
  memberMap: Record<string, { uid: string; name: string }>
}) {
  const { task, children } = node
  const isCollapsed = collapsed.has(task.id)
  const hasChildren = children.length > 0
  const assignee = task.assigneeId ? memberMap[task.assigneeId] : undefined

  const initials = assignee
    ? assignee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : null

  return (
    <>
      <div
        className="grid grid-cols-[1fr_120px_120px_100px] px-4 py-2.5 border-b border-[#2A2A2A] hover:bg-[#0F0F0F]/50 transition-colors group"
      >
        {/* Task name + chevron */}
        <div
          className="flex items-center gap-1"
          style={{ paddingLeft: `${depth * 24}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleCollapse(task.id)
              }}
              aria-expanded={!isCollapsed}
              aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${task.title} subtasks`}
              className="text-[#6B7280] hover:text-[#F5F5F5] p-0.5"
            >
              {isCollapsed ? (
                <ChevronRight size={14} aria-hidden="true" />
              ) : (
                <ChevronDown size={14} aria-hidden="true" />
              )}
            </button>
          ) : (
            <span className="w-[22px]" />
          )}

          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: TASK_TYPE_COLORS[task.type] }}
          />

          <button
            onClick={() => selectTask(task.id)}
            className="text-sm text-[#F5F5F5] hover:text-[#F97316] transition-colors truncate text-left"
          >
            {task.title}
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: STATUS_COLORS[task.status] + '20',
              color: STATUS_COLORS[task.status],
            }}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[task.status] }}
            />
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center">
          {initials ? (
            <div className="flex items-center gap-1.5">
              <div aria-hidden="true" className="w-5 h-5 rounded-full bg-[#F97316]/30 flex items-center justify-center text-[9px] font-medium text-[#F97316]">
                {initials}
              </div>
              <span className="text-xs text-[#6B7280] truncate">
                {assignee?.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#6B7280]">—</span>
          )}
        </div>

        {/* Due Date */}
        <div className="flex items-center">
          {task.dueDate ? (
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <Calendar size={10} aria-hidden="true" />
              <span>{task.dueDate}</span>
            </div>
          ) : (
            <span className="text-xs text-[#6B7280]">—</span>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren &&
        !isCollapsed &&
        children.map((child) => (
          <TreeRow
            key={child.task.id}
            node={child}
            depth={depth + 1}
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
            selectTask={selectTask}
            memberMap={memberMap}
          />
        ))}
    </>
  )
}
