'use client'

import { useMemo } from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Calendar } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { Task, TaskStatus } from '@/types'
import {
  TASK_TYPE_COLORS,
  PRIORITY_COLORS,
  STATUS_COLUMNS,
  STATUS_LABELS,
} from '@/types'

// ── Draggable Card ──
function DraggableCard({ task }: { task: Task }) {
  const members = useAuthStore((s) => s.members)
  const selectTask = useTaskStore((s) => s.selectTask)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const assignee = task.assigneeId
    ? members.find((m) => m.uid === task.assigneeId)
    : null

  const initials = assignee
    ? assignee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => selectTask(task.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          selectTask(task.id)
        }
      }}
      aria-label={`${task.title}, ${task.type}, ${task.priority} priority`}
      className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-3 mb-2 cursor-grab hover:border-[#3A3A3A] transition-colors"
    >
      {/* Priority left border indicator */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
      />

      {/* Type badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: TASK_TYPE_COLORS[task.type] }}
        />
        <span className="text-xs text-[#6B7280] capitalize">{task.type}</span>
      </div>

      {/* Title */}
      <p className="text-sm text-[#F5F5F5] font-medium mb-2 line-clamp-2">
        {task.title}
      </p>

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between">
        {initials ? (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
            style={{ backgroundColor: TASK_TYPE_COLORS[task.type] + '80' }}
            aria-label={assignee?.name}
            title={assignee?.name}
          >
            {initials}
          </div>
        ) : (
          <div />
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
            <Calendar size={10} aria-hidden="true" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Droppable Column ──
function DroppableColumn({
  status,
  tasks,
}: {
  status: TaskStatus
  tasks: Task[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])

  return (
    <div
      ref={setNodeRef}
      aria-label={`${STATUS_LABELS[status]} column, ${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
      className={`bg-[#1A1A1A] rounded-xl p-4 min-h-[200px] min-w-[260px] flex-1 transition-colors ${
        isOver ? 'ring-2 ring-[#F97316]/40' : ''
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#F5F5F5]">
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-[#6B7280] bg-[#0F0F0F] px-2 py-0.5 rounded-full" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-0">
          {tasks.map((task) => (
            <DraggableCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

// ── Kanban Board ──
export default function KanbanBoard({ projectId }: { projectId: string }) {
  const { tasks, moveTask } = useTaskStore()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const projectTasks = useMemo(
    () => Object.values(tasks).filter((t) => t.projectId === projectId),
    [tasks, projectId]
  )

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    }
    projectTasks.forEach((t) => map[t.status].push(t))
    return map
  }, [projectTasks])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    // If dropped on a column
    if (STATUS_COLUMNS.includes(overId as TaskStatus)) {
      moveTask(taskId, overId as TaskStatus)
      return
    }

    // If dropped on another task, find that task's status
    const overTask = tasks[overId]
    if (overTask) {
      moveTask(taskId, overTask.status)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div aria-label="Kanban board" className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
          />
        ))}
      </div>
    </DndContext>
  )
}
