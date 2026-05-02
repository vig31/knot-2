import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  activeSectionId: 'chat' | 'tasks' | 'mindmap' | 'settings'
  activeItemId: string
  toggleSidebar: () => void
  setActiveSection: (section: UIStore['activeSectionId']) => void
  setActiveItem: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activeSectionId: 'chat',
  activeItemId: '',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActiveSection: (section) => set({ activeSectionId: section }),
  setActiveItem: (id) => set({ activeItemId: id }),
}))
