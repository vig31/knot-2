import type { UserProfile, Organization, Channel, Message, Project, Task, MindMap } from '@/types'

export const mockUsers: UserProfile[] = [
  { uid: 'u1', name: 'Vignesh K', email: 'vignesh@knot.app', role: 'owner', orgId: 'org1', createdAt: new Date('2024-01-01') },
  { uid: 'u2', name: 'Riya Menon', email: 'riya@knot.app', role: 'admin', orgId: 'org1', createdAt: new Date('2024-01-05') },
  { uid: 'u3', name: 'Arjun Pillai', email: 'arjun@knot.app', role: 'member', orgId: 'org1', createdAt: new Date('2024-01-10') },
]

export const mockOrg: Organization = {
  id: 'org1',
  name: 'Knot Labs',
  ownerId: 'u1',
  members: ['u1', 'u2', 'u3'],
  createdAt: new Date('2024-01-01'),
}

export const mockChannels: Channel[] = [
  { id: 'c1', type: 'group', name: 'general', members: ['u1', 'u2', 'u3'], unreadCount: 2 },
  { id: 'c2', type: 'group', name: 'design', members: ['u1', 'u2'], unreadCount: 0 },
  { id: 'dm-u1-u2', type: 'dm', members: ['u1', 'u2'], unreadCount: 1 },
  { id: 'dm-u1-u3', type: 'dm', members: ['u1', 'u3'], unreadCount: 0 },
]

export const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', senderId: 'u1', senderName: 'Vignesh K', content: 'Hey team, welcome to #general! 🎉', timestamp: new Date('2024-03-01T09:00:00'), channelId: 'c1', type: 'text' },
    { id: 'm2', senderId: 'u2', senderName: 'Riya Menon', content: 'Thanks! Excited to get started.', timestamp: new Date('2024-03-01T09:05:00'), channelId: 'c1', type: 'text' },
    { id: 'm3', senderId: 'u3', senderName: 'Arjun Pillai', content: 'Let\'s ship something great this sprint 🚀', timestamp: new Date('2024-03-01T09:10:00'), channelId: 'c1', type: 'text' },
    { id: 'm4', senderId: 'u1', senderName: 'Vignesh K', content: 'I\'ve set up the Kanban board. Check the tasks section.', timestamp: new Date('2024-03-01T10:00:00'), channelId: 'c1', type: 'text' },
    { id: 'm5', senderId: 'u2', senderName: 'Riya Menon', content: 'Looks good! I\'ll start on the designs today.', timestamp: new Date('2024-03-01T10:15:00'), channelId: 'c1', type: 'text' },
  ],
  c2: [
    { id: 'm6', senderId: 'u1', senderName: 'Vignesh K', content: 'Design channel created. Share all mockups here.', timestamp: new Date('2024-03-01T11:00:00'), channelId: 'c2', type: 'text' },
    { id: 'm7', senderId: 'u2', senderName: 'Riya Menon', content: 'Will upload the wireframes shortly.', timestamp: new Date('2024-03-01T11:30:00'), channelId: 'c2', type: 'text' },
  ],
  'dm-u1-u2': [
    { id: 'm8', senderId: 'u1', senderName: 'Vignesh K', content: 'Hey Riya, can you review the landing page?', timestamp: new Date('2024-03-02T09:00:00'), channelId: 'dm-u1-u2', type: 'text' },
    { id: 'm9', senderId: 'u2', senderName: 'Riya Menon', content: 'Sure, I\'ll take a look this afternoon!', timestamp: new Date('2024-03-02T09:15:00'), channelId: 'dm-u1-u2', type: 'text' },
    { id: 'm10', senderId: 'u2', senderName: 'Riya Menon', content: 'The hero section looks great. Maybe we can tweak the CTA color?', timestamp: new Date('2024-03-02T14:00:00'), channelId: 'dm-u1-u2', type: 'text' },
  ],
  'dm-u1-u3': [
    { id: 'm11', senderId: 'u3', senderName: 'Arjun Pillai', content: 'Hey, should I start on the API integration?', timestamp: new Date('2024-03-02T10:00:00'), channelId: 'dm-u1-u3', type: 'text' },
    { id: 'm12', senderId: 'u1', senderName: 'Vignesh K', content: 'Let\'s hold off until Phase 2. Focus on the frontend first.', timestamp: new Date('2024-03-02T10:30:00'), channelId: 'dm-u1-u3', type: 'text' },
  ],
}

export const mockProjects: Project[] = [
  { id: 'p1', orgId: 'org1', name: 'Mobile App Launch', color: '#8B5CF6', status: 'active', description: 'Launch the mobile app MVP' },
  { id: 'p2', orgId: 'org1', name: 'Website Redesign', color: '#3B82F6', status: 'active', description: 'Redesign the marketing website' },
]

export const mockTasks: Task[] = [
  // Epic 1
  { id: 't1', projectId: 'p1', type: 'epic', title: 'User Authentication', status: 'in_progress', priority: 'critical', assigneeId: 'u1', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01'), description: 'Implement full authentication flow' },
  // Feature 1.1
  { id: 't2', projectId: 'p1', parentId: 't1', type: 'feature', title: 'Login Flow', status: 'done', priority: 'high', assigneeId: 'u1', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-05') },
  // Story 1.1.1
  { id: 't3', projectId: 'p1', parentId: 't2', type: 'story', title: 'Email/password login', status: 'done', priority: 'high', assigneeId: 'u1', dueDate: '2024-03-10', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-05') },
  // Task 1.1.1.1
  { id: 't4', projectId: 'p1', parentId: 't3', type: 'task', title: 'Build login form UI', status: 'done', priority: 'medium', assigneeId: 'u1', createdAt: new Date('2024-03-02'), updatedAt: new Date('2024-03-04') },
  // Task 1.1.1.2
  { id: 't5', projectId: 'p1', parentId: 't3', type: 'task', title: 'Add form validation', status: 'done', priority: 'medium', assigneeId: 'u3', createdAt: new Date('2024-03-02'), updatedAt: new Date('2024-03-05') },
  // Feature 1.2
  { id: 't6', projectId: 'p1', parentId: 't1', type: 'feature', title: 'Registration Flow', status: 'in_progress', priority: 'high', assigneeId: 'u2', createdAt: new Date('2024-03-02'), updatedAt: new Date('2024-03-06') },
  // Story 1.2.1
  { id: 't7', projectId: 'p1', parentId: 't6', type: 'story', title: 'New user signup form', status: 'in_progress', priority: 'high', assigneeId: 'u2', dueDate: '2024-03-15', createdAt: new Date('2024-03-02'), updatedAt: new Date('2024-03-06') },
  // Task 1.2.1.1
  { id: 't8', projectId: 'p1', parentId: 't7', type: 'task', title: 'Build registration form', status: 'in_progress', priority: 'medium', assigneeId: 'u2', createdAt: new Date('2024-03-03'), updatedAt: new Date('2024-03-06') },
  // Task 1.2.1.2
  { id: 't9', projectId: 'p1', parentId: 't7', type: 'task', title: 'Email verification', status: 'todo', priority: 'medium', assigneeId: 'u2', createdAt: new Date('2024-03-03'), updatedAt: new Date('2024-03-03') },
  // Story 1.2.2
  { id: 't10', projectId: 'p1', parentId: 't6', type: 'story', title: 'Org creation wizard', status: 'backlog', priority: 'medium', assigneeId: 'u1', createdAt: new Date('2024-03-03'), updatedAt: new Date('2024-03-03') },

  // Epic 2
  { id: 't11', projectId: 'p1', type: 'epic', title: 'Dashboard & Navigation', status: 'todo', priority: 'high', assigneeId: 'u2', createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05'), description: 'Build main dashboard and nav structure' },
  // Feature 2.1
  { id: 't12', projectId: 'p1', parentId: 't11', type: 'feature', title: 'Sidebar Navigation', status: 'todo', priority: 'high', assigneeId: 'u2', createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05') },
  // Story 2.1.1
  { id: 't13', projectId: 'p1', parentId: 't12', type: 'story', title: 'Collapsible sidebar', status: 'todo', priority: 'medium', assigneeId: 'u3', dueDate: '2024-03-20', createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05') },
  // Task 2.1.1.1
  { id: 't14', projectId: 'p1', parentId: 't13', type: 'task', title: 'Sidebar layout component', status: 'backlog', priority: 'medium', assigneeId: 'u3', createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05') },
  // Feature 2.2
  { id: 't15', projectId: 'p1', parentId: 't11', type: 'feature', title: 'Dashboard widgets', status: 'backlog', priority: 'medium', assigneeId: 'u2', createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05') },
  // Story 2.2.1
  { id: 't16', projectId: 'p1', parentId: 't15', type: 'story', title: 'Task summary cards', status: 'in_review', priority: 'low', assigneeId: 'u2', createdAt: new Date('2024-03-06'), updatedAt: new Date('2024-03-08') },
  // Subtask
  { id: 't17', projectId: 'p1', parentId: 't14', type: 'subtask', title: 'Style sidebar icons', status: 'backlog', priority: 'low', assigneeId: 'u3', createdAt: new Date('2024-03-06'), updatedAt: new Date('2024-03-06') },

  // Project 2 tasks
  { id: 't18', projectId: 'p2', type: 'epic', title: 'Landing Page Redesign', status: 'in_progress', priority: 'high', assigneeId: 'u2', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01'), description: 'Redesign the marketing landing page' },
  { id: 't19', projectId: 'p2', parentId: 't18', type: 'feature', title: 'Hero Section', status: 'done', priority: 'high', assigneeId: 'u2', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-04') },
  { id: 't20', projectId: 'p2', parentId: 't18', type: 'feature', title: 'Testimonials Section', status: 'in_progress', priority: 'medium', assigneeId: 'u1', createdAt: new Date('2024-03-02'), updatedAt: new Date('2024-03-06') },
]

export const mockMindMaps: MindMap[] = [
  {
    id: 'mm1',
    name: 'Product Roadmap',
    orgId: 'org1',
    createdAt: new Date('2024-03-01'),
    nodes: [
      { id: 'n1', mapId: 'mm1', label: 'Knot MVP', x: 400, y: 50, color: '#F97316' },
      { id: 'n2', mapId: 'mm1', label: 'Authentication', x: 150, y: 200, color: '#8B5CF6', linkedTaskId: 't1' },
      { id: 'n3', mapId: 'mm1', label: 'Dashboard', x: 400, y: 200, color: '#3B82F6', linkedTaskId: 't11' },
      { id: 'n4', mapId: 'mm1', label: 'Chat System', x: 650, y: 200, color: '#10B981' },
      { id: 'n5', mapId: 'mm1', label: 'Login', x: 50, y: 350, color: '#8B5CF6', linkedTaskId: 't2' },
      { id: 'n6', mapId: 'mm1', label: 'Register', x: 250, y: 350, color: '#8B5CF6', linkedTaskId: 't6' },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n1', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n1', targetNodeId: 'n4' },
      { id: 'e4', sourceNodeId: 'n2', targetNodeId: 'n5' },
      { id: 'e5', sourceNodeId: 'n2', targetNodeId: 'n6' },
    ],
  },
]

export const testimonials = [
  { name: 'Riya Menon', role: 'Product Manager @ Zuri Labs', avatar: 'RM', review: 'Finally one place for our standups, tasks, and roadmap planning. The mind map to task link is a game changer.' },
  { name: 'Arjun Pillai', role: 'Engineering Lead @ Stackd', avatar: 'AP', review: 'The Kanban + list hybrid view is exactly what our sprint reviews needed. Onboarded the team in under 20 minutes.' },
  { name: 'Sneha Krishnan', role: 'Founder @ Pebble Studio', avatar: 'SK', review: 'As a small team we needed something that didn\'t feel like Jira. This hits the right balance of power and simplicity.' },
  { name: 'Vikram Anand', role: 'Ops Lead @ Flux Co', avatar: 'VA', review: 'Group channels + task assignments in one sidebar changed how we run our weekly syncs.' },
]
