import { create } from 'zustand'
import type { MindMap, MindMapNode, MindMapEdge } from '@/types'
import { mockMindMaps } from '@/data/mockData'

interface MindMapStore {
  maps: Record<string, MindMap>
  activeMapId: string | null
  selectedNodeId: string | null

  setActiveMap: (id: string) => void
  createMap: (name: string) => void
  addNode: (mapId: string, node: Omit<MindMapNode, 'id'>) => void
  updateNode: (mapId: string, nodeId: string, patch: Partial<MindMapNode>) => void
  deleteNode: (mapId: string, nodeId: string) => void
  addEdge: (mapId: string, edge: Omit<MindMapEdge, 'id'>) => void
  deleteEdge: (mapId: string, edgeId: string) => void
  linkNodeToTask: (mapId: string, nodeId: string, taskId: string) => void
  unlinkNodeFromTask: (mapId: string, nodeId: string) => void
  selectNode: (nodeId: string | null) => void
}

export const useMindMapStore = create<MindMapStore>((set) => ({
  maps: Object.fromEntries(mockMindMaps.map((m) => [m.id, m])),
  activeMapId: 'mm1',
  selectedNodeId: null,

  setActiveMap: (id) => set({ activeMapId: id }),

  createMap: (name) => {
    const id = `mm-${Date.now()}`
    const newMap: MindMap = {
      id,
      name,
      orgId: 'org1',
      nodes: [],
      edges: [],
      createdAt: new Date(),
    }
    set((s) => ({ maps: { ...s.maps, [id]: newMap }, activeMapId: id }))
  },

  addNode: (mapId, node) => {
    const id = `n-${Date.now()}`
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: { ...map, nodes: [...map.nodes, { ...node, id }] },
        },
      }
    })
  },

  updateNode: (mapId, nodeId, patch) => {
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: {
            ...map,
            nodes: map.nodes.map((n) => (n.id === nodeId ? { ...n, ...patch } : n)),
          },
        },
      }
    })
  },

  deleteNode: (mapId, nodeId) => {
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: {
            ...map,
            nodes: map.nodes.filter((n) => n.id !== nodeId),
            edges: map.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId),
          },
        },
      }
    })
  },

  addEdge: (mapId, edge) => {
    const id = `e-${Date.now()}`
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: { ...map, edges: [...map.edges, { ...edge, id }] },
        },
      }
    })
  },

  deleteEdge: (mapId, edgeId) => {
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: { ...map, edges: map.edges.filter((e) => e.id !== edgeId) },
        },
      }
    })
  },

  linkNodeToTask: (mapId, nodeId, taskId) => {
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: {
            ...map,
            nodes: map.nodes.map((n) => (n.id === nodeId ? { ...n, linkedTaskId: taskId } : n)),
          },
        },
      }
    })
  },

  unlinkNodeFromTask: (mapId, nodeId) => {
    set((s) => {
      const map = s.maps[mapId]
      if (!map) return s
      return {
        maps: {
          ...s.maps,
          [mapId]: {
            ...map,
            nodes: map.nodes.map((n) => (n.id === nodeId ? { ...n, linkedTaskId: undefined } : n)),
          },
        },
      }
    })
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
}))
