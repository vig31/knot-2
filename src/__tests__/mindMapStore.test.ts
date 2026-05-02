import { useMindMapStore } from '@/stores/mindMapStore'

beforeEach(() => {
  useMindMapStore.setState(useMindMapStore.getInitialState())
})

describe('mindMapStore', () => {
  describe('createMap', () => {
    it('adds a new map and sets it as active', () => {
      const { createMap } = useMindMapStore.getState()
      const before = Object.keys(useMindMapStore.getState().maps).length

      createMap('My New Map')

      const state = useMindMapStore.getState()
      expect(Object.keys(state.maps).length).toBe(before + 1)
      const newMap = Object.values(state.maps).find((m) => m.name === 'My New Map')
      expect(newMap).toBeDefined()
      expect(state.activeMapId).toBe(newMap!.id)
    })

    it('creates map with empty nodes and edges', () => {
      const { createMap } = useMindMapStore.getState()
      createMap('Empty Map')

      const newMap = Object.values(useMindMapStore.getState().maps).find((m) => m.name === 'Empty Map')
      expect(newMap!.nodes).toEqual([])
      expect(newMap!.edges).toEqual([])
    })
  })

  describe('addNode', () => {
    it('adds a node to the specified map', () => {
      const { addNode } = useMindMapStore.getState()
      const mapId = 'mm1'
      const before = useMindMapStore.getState().maps[mapId].nodes.length

      addNode(mapId, { mapId, label: 'Test Node', x: 100, y: 200 })

      const after = useMindMapStore.getState().maps[mapId].nodes.length
      expect(after).toBe(before + 1)
    })

    it('assigns a generated id to the new node', () => {
      const { addNode } = useMindMapStore.getState()
      addNode('mm1', { mapId: 'mm1', label: 'IDed Node', x: 0, y: 0 })

      const nodes = useMindMapStore.getState().maps['mm1'].nodes
      const newNode = nodes.find((n) => n.label === 'IDed Node')
      expect(newNode).toBeDefined()
      expect(newNode!.id).toMatch(/^n-/)
    })

    it('does nothing when mapId does not exist', () => {
      const { addNode } = useMindMapStore.getState()
      const before = { ...useMindMapStore.getState().maps }

      addNode('nonexistent', { mapId: 'nonexistent', label: 'Ghost', x: 0, y: 0 })

      expect(useMindMapStore.getState().maps).toEqual(before)
    })
  })

  describe('updateNode', () => {
    it('patches node fields', () => {
      const { updateNode } = useMindMapStore.getState()
      updateNode('mm1', 'n1', { label: 'Updated Label', color: '#FF0000' })

      const node = useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n1')
      expect(node!.label).toBe('Updated Label')
      expect(node!.color).toBe('#FF0000')
    })

    it('does not affect other nodes', () => {
      const { updateNode } = useMindMapStore.getState()
      const n2Before = { ...useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n2') }

      updateNode('mm1', 'n1', { label: 'Changed' })

      const n2After = useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n2')
      expect(n2After!.label).toBe(n2Before.label)
    })
  })

  describe('deleteNode', () => {
    it('removes the node from the map', () => {
      const { deleteNode } = useMindMapStore.getState()
      expect(useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n1')).toBeDefined()

      deleteNode('mm1', 'n1')

      expect(useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n1')).toBeUndefined()
    })

    it('removes edges connected to the deleted node', () => {
      const { deleteNode } = useMindMapStore.getState()
      // n1 has edges e1, e2, e3 (as source)
      deleteNode('mm1', 'n1')

      const edges = useMindMapStore.getState().maps['mm1'].edges
      expect(edges.find((e) => e.sourceNodeId === 'n1')).toBeUndefined()
      expect(edges.find((e) => e.targetNodeId === 'n1')).toBeUndefined()
    })
  })

  describe('addEdge', () => {
    it('adds an edge to the map', () => {
      const { addEdge } = useMindMapStore.getState()
      const before = useMindMapStore.getState().maps['mm1'].edges.length

      addEdge('mm1', { sourceNodeId: 'n3', targetNodeId: 'n5' })

      const after = useMindMapStore.getState().maps['mm1'].edges.length
      expect(after).toBe(before + 1)
    })

    it('assigns a generated id to the new edge', () => {
      const { addEdge } = useMindMapStore.getState()
      addEdge('mm1', { sourceNodeId: 'n3', targetNodeId: 'n6' })

      const edges = useMindMapStore.getState().maps['mm1'].edges
      const newEdge = edges.find((e) => e.sourceNodeId === 'n3' && e.targetNodeId === 'n6')
      expect(newEdge).toBeDefined()
      expect(newEdge!.id).toMatch(/^e-/)
    })
  })

  describe('deleteEdge', () => {
    it('removes the edge from the map', () => {
      const { deleteEdge } = useMindMapStore.getState()
      expect(useMindMapStore.getState().maps['mm1'].edges.find((e) => e.id === 'e1')).toBeDefined()

      deleteEdge('mm1', 'e1')

      expect(useMindMapStore.getState().maps['mm1'].edges.find((e) => e.id === 'e1')).toBeUndefined()
    })
  })

  describe('linkNodeToTask / unlinkNodeFromTask', () => {
    it('sets linkedTaskId on the node', () => {
      const { linkNodeToTask } = useMindMapStore.getState()
      // n4 has no linkedTaskId initially
      linkNodeToTask('mm1', 'n4', 't5')

      const node = useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n4')
      expect(node!.linkedTaskId).toBe('t5')
    })

    it('clears linkedTaskId when unlinking', () => {
      const { unlinkNodeFromTask } = useMindMapStore.getState()
      // n2 already has linkedTaskId: 't1'
      unlinkNodeFromTask('mm1', 'n2')

      const node = useMindMapStore.getState().maps['mm1'].nodes.find((n) => n.id === 'n2')
      expect(node!.linkedTaskId).toBeUndefined()
    })
  })

  describe('selectNode', () => {
    it('sets selectedNodeId', () => {
      const { selectNode } = useMindMapStore.getState()
      expect(useMindMapStore.getState().selectedNodeId).toBeNull()

      selectNode('n3')
      expect(useMindMapStore.getState().selectedNodeId).toBe('n3')

      selectNode(null)
      expect(useMindMapStore.getState().selectedNodeId).toBeNull()
    })
  })
})
