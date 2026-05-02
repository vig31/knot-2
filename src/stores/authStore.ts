import { create } from 'zustand'
import type { UserProfile } from '@/types'
import { mockUsers, mockOrg } from '@/data/mockData'

interface AuthStore {
  user: UserProfile | null
  orgId: string | null
  isLoading: boolean
  error: string | null
  members: UserProfile[]
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
  setOrg: (orgId: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: mockUsers[0],
  orgId: mockOrg.id,
  isLoading: false,
  error: null,
  members: mockUsers,

  login: (email: string) => {
    const found = mockUsers.find((u) => u.email === email)
    if (found) {
      set({ user: found, orgId: mockOrg.id, error: null })
    } else {
      set({ user: mockUsers[0], orgId: mockOrg.id, error: null })
    }
  },

  register: (name: string, email: string) => {
    const newUser: UserProfile = {
      uid: `u${Date.now()}`,
      name,
      email,
      role: 'owner',
      orgId: '',
      createdAt: new Date(),
    }
    set({ user: newUser, error: null })
  },

  logout: () => {
    set({ user: null, orgId: null })
  },

  setOrg: (orgId: string) => {
    set({ orgId })
  },
}))
