import { create } from 'zustand'
import type { Project, Task, TaskStatus } from '@/types'
import { mockProjects, mockTasks } from '@/data/mockData'

type ActiveView = 'kanban' | 'table' | 'list' | 'chart'

interface TaskStore {
  projects: Record<string, Project>
  tasks: Record<string, Task>
  activeProjectId: string | null
  activeView: ActiveView
  selectedTaskId: string | null

  setActiveProject: (id: string) => void
  setView: (view: ActiveView) => void
  selectTask: (id: string | null) => void
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, newStatus: TaskStatus) => void
  getTasksByProject: (projectId: string) => Task[]
  getChildTasks: (parentId: string) => Task[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  projects: Object.fromEntries(mockProjects.map((p) => [p.id, p])),
  tasks: Object.fromEntries(mockTasks.map((t) => [t.id, t])),
  activeProjectId: 'p1',
  activeView: 'kanban',
  selectedTaskId: null,

  setActiveProject: (id) => set({ activeProjectId: id }),
  setView: (view) => set({ activeView: view }),
  selectTask: (id) => set({ selectedTaskId: id }),

  createTask: (task) => {
    const id = `t-${Date.now()}`
    const now = new Date()
    const newTask: Task = { ...task, id, createdAt: now, updatedAt: now }
    set((s) => ({ tasks: { ...s.tasks, [id]: newTask } }))
  },

  updateTask: (id, patch) => {
    set((s) => ({
      tasks: {
        ...s.tasks,
        [id]: { ...s.tasks[id], ...patch, updatedAt: new Date() },
      },
    }))
  },

  deleteTask: (id) => {
    set((s) => {
      const { [id]: _, ...rest } = s.tasks
      return { tasks: rest }
    })
  },

  moveTask: (id, newStatus) => {
    get().updateTask(id, { status: newStatus })
  },

  getTasksByProject: (projectId) => {
    return Object.values(get().tasks).filter((t) => t.projectId === projectId)
  },

  getChildTasks: (parentId) => {
    return Object.values(get().tasks).filter((t) => t.parentId === parentId)
  },
}))
