'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTaskStore } from '@/stores/taskStore'
import { LayoutGrid, Table2, List, PieChart, Plus } from 'lucide-react'
import KanbanBoard from '@/components/tasks/KanbanBoard'
import TaskTable from '@/components/tasks/TaskTable'
import TaskListTree from '@/components/tasks/TaskListTree'
import TaskPieChart from '@/components/tasks/TaskPieChart'
import TaskDetailDrawer from '@/components/tasks/TaskDetailDrawer'
import AddTaskModal from '@/components/tasks/AddTaskModal'

type ViewMode = 'kanban' | 'table' | 'list' | 'chart'

const VIEW_TABS: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: 'kanban', label: 'Kanban', icon: <LayoutGrid size={16} /> },
  { key: 'table', label: 'Table', icon: <Table2 size={16} /> },
  { key: 'list', label: 'List', icon: <List size={16} /> },
  { key: 'chart', label: 'Chart', icon: <PieChart size={16} /> },
]

function TaskContent({ projectId }: { projectId: string }) {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view') as ViewMode | null
  const { projects, setActiveProject, setView, activeView } = useTaskStore()
  const [modalOpen, setModalOpen] = useState(false)

  const currentView = viewParam || activeView || 'kanban'
  const project = projects[projectId]

  useEffect(() => {
    setActiveProject(projectId)
  }, [projectId, setActiveProject])

  useEffect(() => {
    if (viewParam) setView(viewParam)
  }, [viewParam, setView])

  const handleViewChange = (view: ViewMode) => {
    setView(view)
    const url = new URL(window.location.href)
    url.searchParams.set('view', view)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0F0F0F]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-[#F5F5F5]">
            {project?.name ?? 'Project'}
          </h1>
          <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
            {VIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleViewChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === tab.key
                    ? 'bg-[#F97316]/15 text-[#F97316] border-b-2 border-[#F97316]'
                    : 'text-[#6B7280] hover:text-[#F5F5F5]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-medium hover:bg-[#EA580C] transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {currentView === 'kanban' && <KanbanBoard projectId={projectId} />}
        {currentView === 'table' && <TaskTable projectId={projectId} />}
        {currentView === 'list' && <TaskListTree projectId={projectId} />}
        {currentView === 'chart' && <TaskPieChart projectId={projectId} />}
      </div>

      <TaskDetailDrawer />
      <AddTaskModal
        projectId={projectId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default function TaskProjectClient({ projectId }: { projectId: string }) {
  return (
    <Suspense fallback={null}>
      <TaskContent projectId={projectId} />
    </Suspense>
  )
}
