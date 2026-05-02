'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMindMapStore } from '@/stores/mindMapStore'
import MindMapCanvas from '@/components/mindmap/MindMapCanvas'

export default function MindMapPage() {
  return (
    <Suspense fallback={null}>
      <MindMapPageContent />
    </Suspense>
  )
}

function MindMapPageContent() {
  const searchParams = useSearchParams()
  const mapId = searchParams.get('mapId')
  const { maps, setActiveMap } = useMindMapStore()

  useEffect(() => {
    if (mapId) setActiveMap(mapId)
  }, [mapId, setActiveMap])

  const map = mapId ? maps[mapId] : null

  return (
    <div className="flex h-full flex-col bg-[#0F0F0F]">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3">
        <h1 className="text-lg font-semibold text-[#F5F5F5]">
          {map?.name ?? 'Mind Map'}
        </h1>
        <span className="text-xs text-[#6B7280]">
          {map ? `${map.nodes.length} nodes` : ''}
        </span>
      </header>

      {/* Canvas */}
      <div className="flex-1">
        <MindMapCanvas />
      </div>
    </div>
  )
}
