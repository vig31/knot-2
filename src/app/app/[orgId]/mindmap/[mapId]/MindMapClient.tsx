'use client'

import { useEffect } from 'react'
import { useMindMapStore } from '@/stores/mindMapStore'
import MindMapCanvas from '@/components/mindmap/MindMapCanvas'

export default function MindMapClient({ mapId }: { mapId: string }) {
  const { maps, setActiveMap } = useMindMapStore()

  useEffect(() => {
    setActiveMap(mapId)
  }, [mapId, setActiveMap])

  const map = maps[mapId]

  return (
    <div className="flex h-full flex-col bg-[#0F0F0F]">
      <header className="flex items-center gap-3 border-b border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3">
        <h1 className="text-lg font-semibold text-[#F5F5F5]">
          {map?.name ?? 'Mind Map'}
        </h1>
        <span className="text-xs text-[#6B7280]">
          {map ? `${map.nodes.length} nodes` : ''}
        </span>
      </header>
      <div className="flex-1">
        <MindMapCanvas />
      </div>
    </div>
  )
}
