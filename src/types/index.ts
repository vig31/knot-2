// ── User & Auth ──
export interface UserProfile {
  uid: string
  name: string
  email: string
  avatarUrl?: string
  orgId: string
  role: 'owner' | 'admin' | 'member'
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  ownerId: string
  members: string[]
  createdAt: Date
}

// ── Chat ──
export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  channelId: string
  type: 'text'
}

export interface Channel {
  id: string
  type: 'dm' | 'group'
  name?: string
  members: string[]
  lastMessage?: Message
  unreadCount: number
}

// ── Tasks ──
export type TaskType = 'epic' | 'feature' | 'story' | 'task' | 'subtask'
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Task {
  id: string
  projectId: string
  parentId?: string
  type: TaskType
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  linkedMindMapNodeId?: string
}

export interface Project {
  id: string
  orgId: string
  name: string
  description?: string
  color: string
  status: 'active' | 'archived'
}

// ── Mind Map ──
export interface MindMapNode {
  id: string
  mapId: string
  label: string
  x: number
  y: number
  color?: string
  linkedTaskId?: string
  parentNodeId?: string
}

export interface MindMapEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  label?: string
}

export interface MindMap {
  id: string
  name: string
  orgId: string
  nodes: MindMapNode[]
  edges: MindMapEdge[]
  createdAt: Date
}

// ── UI Constants ──
export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  epic: '#8B5CF6',
  feature: '#3B82F6',
  story: '#10B981',
  task: '#F97316',
  subtask: '#6B7280',
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#6B7280',
}

export const STATUS_COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}
