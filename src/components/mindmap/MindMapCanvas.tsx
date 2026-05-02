'use client'

import { useCallback, useMemo, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge as rfAddEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type NodeTypes,
  type Node,
  type Edge,
  type OnNodeDrag,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMindMapStore } from '@/stores/mindMapStore'
import MindMapNodeComponent from './MindMapNodeComponent'

const nodeTypes: NodeTypes = {
  mindMapNode: MindMapNodeComponent,
}

function MindMapCanvasInner() {
  const {
    maps,
    activeMapId,
    selectedNodeId,
    addNode,
    updateNode,
    deleteNode,
    addEdge: storeAddEdge,
    selectNode,
  } = useMindMapStore()

  const map = activeMapId ? maps[activeMapId] : null

  const initialNodes: Node[] = useMemo(
    () =>
      (map?.nodes ?? []).map((node) => ({
        id: node.id,
        position: { x: node.x, y: node.y },
        data: {
          label: node.label,
          color: node.color,
          linkedTaskId: node.linkedTaskId,
        },
        type: 'mindMapNode' as const,
        selected: node.id === selectedNodeId,
      })),
    [map?.nodes, selectedNodeId],
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      (map?.edges ?? []).map((edge) => ({
        id: edge.id,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        label: edge.label,
        style: { stroke: '#6B7280' },
        animated: true,
      })),
    [map?.edges],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Sync store changes → local React Flow state
  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!activeMapId || !connection.source || !connection.target) return
      setEdges((eds) => rfAddEdge(connection, eds))
      storeAddEdge(activeMapId, {
        sourceNodeId: connection.source,
        targetNodeId: connection.target,
      })
    },
    [activeMapId, storeAddEdge, setEdges],
  )

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_event, node) => {
      if (!activeMapId) return
      updateNode(activeMapId, node.id, {
        x: node.position.x,
        y: node.position.y,
      })
    },
    [activeMapId, updateNode],
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode],
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!activeMapId) return
      const target = event.target as HTMLElement
      // Only add node when double-clicking the pane, not a node
      if (target.closest('.react-flow__node')) return

      const label = prompt('Node label:')
      if (!label) return

      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top

      addNode(activeMapId, {
        mapId: activeMapId,
        label,
        x,
        y,
      })
    },
    [activeMapId, addNode],
  )

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (!activeMapId || !selectedNodeId) return
        // Don't delete when typing in an input
        if ((event.target as HTMLElement).tagName === 'INPUT') return
        deleteNode(activeMapId, selectedNodeId)
        selectNode(null)
      }
    },
    [activeMapId, selectedNodeId, deleteNode, selectNode],
  )

  if (!map) {
    return (
      <div className="flex h-full items-center justify-center text-[#6B7280]">
        Map not found
      </div>
    )
  }

  return (
    <div
      className="h-full w-full"
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Mind map canvas. Double-click to add a node. Select a node and press Delete to remove it."
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDoubleClick={onDoubleClick}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ animated: true, style: { stroke: '#6B7280' } }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2A2A2A"
          style={{ backgroundColor: '#0F0F0F' }}
        />
        <Controls
          className="!bg-[#1A1A1A] !border-[#2A2A2A] !rounded-lg [&>button]:!bg-[#1A1A1A] [&>button]:!border-[#2A2A2A] [&>button]:!text-[#F5F5F5]"
        />
        <MiniMap
          nodeColor="#F97316"
          maskColor="rgba(15, 15, 15, 0.8)"
          className="!bg-[#1A1A1A] !border-[#2A2A2A] !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}

export default function MindMapCanvas() {
  return (
    <ReactFlowProvider>
      <MindMapCanvasInner />
    </ReactFlowProvider>
  )
}
