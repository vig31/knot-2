'use client'

import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { Link } from 'lucide-react'

interface MindMapNodeData {
  label: string
  color?: string
  linkedTaskId?: string
  [key: string]: unknown
}

export default function MindMapNodeComponent({ data, selected }: NodeProps) {
  const { label, color, linkedTaskId } = data as MindMapNodeData
  const bgColor = color || '#1A1A1A'

  return (
    <div
      className="relative rounded-xl px-4 py-2 shadow-lg border min-w-[120px] text-center"
      style={{
        backgroundColor: bgColor,
        borderColor: selected ? '#F97316' : '#2A2A2A',
        borderWidth: selected ? 2 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#6B7280]" />
      <Handle type="target" position={Position.Left} className="!bg-[#6B7280]" />

      <span className="text-sm font-medium text-[#F5F5F5]">{label as string}</span>

      {linkedTaskId && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316]">
          <Link size={10} className="text-white" />
        </span>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-[#6B7280]" />
      <Handle type="source" position={Position.Right} className="!bg-[#6B7280]" />
    </div>
  )
}
