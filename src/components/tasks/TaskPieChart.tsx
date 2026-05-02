'use client'

import { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTaskStore } from '@/stores/taskStore'
import type { TaskStatus, TaskPriority, TaskType } from '@/types'
import {
  TASK_TYPE_COLORS,
  PRIORITY_COLORS,
  STATUS_LABELS,
} from '@/types'

type Grouping = 'status' | 'priority' | 'type'

const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: '#6B7280',
  todo: '#3B82F6',
  in_progress: '#F97316',
  in_review: '#EAB308',
  done: '#22C55E',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const TYPE_LABELS: Record<TaskType, string> = {
  epic: 'Epic',
  feature: 'Feature',
  story: 'Story',
  task: 'Task',
  subtask: 'Subtask',
}

export default function TaskPieChart({ projectId }: { projectId: string }) {
  const { tasks } = useTaskStore()
  const [grouping, setGrouping] = useState<Grouping>('status')

  const projectTasks = useMemo(
    () => Object.values(tasks).filter((t) => t.projectId === projectId),
    [tasks, projectId]
  )

  const totalCount = projectTasks.length

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}

    projectTasks.forEach((t) => {
      const key = t[grouping]
      counts[key] = (counts[key] || 0) + 1
    })

    let labels: Record<string, string>
    let colors: Record<string, string>

    switch (grouping) {
      case 'status':
        labels = STATUS_LABELS
        colors = STATUS_COLORS
        break
      case 'priority':
        labels = PRIORITY_LABELS
        colors = PRIORITY_COLORS
        break
      case 'type':
        labels = TYPE_LABELS
        colors = TASK_TYPE_COLORS
        break
    }

    return Object.entries(counts).map(([key, value]) => ({
      name: labels[key] ?? key,
      value,
      color: colors[key] ?? '#6B7280',
      percentage: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0,
    }))
  }, [projectTasks, grouping, totalCount])

  const groupButtons: { key: Grouping; label: string }[] = [
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'type', label: 'Type' },
  ]

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-2xl mx-auto">
      {/* Toggle buttons */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {groupButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setGrouping(btn.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              grouping === btn.key
                ? 'bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30'
                : 'text-[#6B7280] hover:text-[#F5F5F5] border border-[#2A2A2A]'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {totalCount === 0 ? (
        <div className="flex items-center justify-center h-64 text-sm text-[#6B7280]">
          No tasks to visualize.
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F0F0F',
                  border: '1px solid #2A2A2A',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '13px',
                }}
                formatter={(value, name) => {
                  const v = Number(value) || 0
                  return [
                    `${v} task${v !== 1 ? 's' : ''} (${totalCount > 0 ? Math.round((v / totalCount) * 100) : 0}%)`,
                    String(name),
                  ]
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value: string) => (
                  <span className="text-sm text-[#F5F5F5]">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: 40 }}>
            <div className="text-center">
              <span className="text-3xl font-bold text-[#F5F5F5]">
                {totalCount}
              </span>
              <br />
              <span className="text-xs text-[#6B7280]">
                {totalCount === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend details with counts + percentages */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 px-3 py-2 bg-[#0F0F0F] rounded-lg"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-[#F5F5F5] truncate">
                {item.name}
              </span>
              <span className="ml-auto text-xs text-[#6B7280] whitespace-nowrap">
                {item.value} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
