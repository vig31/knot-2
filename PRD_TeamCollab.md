# PRD — Knot: Team Collaboration & Workflow Platform

**Version:** 1.0 (Agent-Ready)  
**Author:** Vignesh (product owner)
**Last Updated:** May 2026  
**Status:** Phase 1 Spec — Ready for Agent Implementation

---

## 1. Product Overview

**Product Name:** Knot 
**Type:** SaaS multi-tenant web application  
**Primary Audience:** Small teams (2–10 people)  
**Core Purpose:** Unified hub for team communication, task tracking, and visual workflow planning — eliminating context-switching between chat, project tools, and diagramming apps.

**Elevator Pitch:**  
Knot brings together real-time chat, structured task management with multiple view modes, and a linked mind map canvas into a single cohesive workspace organized around organizations and projects.

---

## 2. Tech Stack (Locked)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + React |
| Styling | Tailwind CSS |
| UI Components | React Bits MCP components |
| Icons | Lucide Icons |
| State Management | Zustand (all client state) |
| Backend | Firebase (Auth + Firestore + Storage) |
| Security | Firestore Security Rules (RLS-equivalent) |
| Hosting | Vercel (frontend) + Firebase (backend) |

**No custom backend server in Phase 1.** All logic runs client-side against Firebase SDK.

---

## 3. Phase Structure

### Phase 1 — Foundation (Current Scope)
**Goal:** Working app shell with mocked/local data. No live Firebase reads/writes yet. Full state management architecture wired up.

**Phase 1 Deliverables:**
1. Landing page (public, unauthenticated)
2. Auth screens (Login / Register / Org Setup)
3. App shell with Slack-style sidebar navigation
4. Chat module (P2P + Group) — local/mock state
5. Task Manager — Kanban, Table, Pie Chart, List views — local/mock state
6. Mind Map module — local canvas, linkable to tasks
7. Full Zustand store structure (all slices defined, even for features not yet live)
8. Firebase config + Firestore Security Rules written (not yet triggered in UI)

**Phase 2 (future):** Live Firebase reads/writes, real-time Firestore listeners, invite flows, notifications, file attachments.

---

## 4. Information Architecture

```
/ (landing page)
/login
/register
/onboarding/create-org

/app
  /app/[orgId]
    /app/[orgId]/chat
      /app/[orgId]/chat/[dmUserId]          ← P2P direct message
      /app/[orgId]/chat/groups/[groupId]    ← Group channel
    /app/[orgId]/tasks
      /app/[orgId]/tasks/[projectId]
        ?view=kanban
        ?view=table
        ?view=list
        ?view=chart
    /app/[orgId]/mindmap
      /app/[orgId]/mindmap/[mapId]
    /app/[orgId]/settings
```

---

## 5. Landing Page

**Purpose:** Public marketing page. Converts visitors to sign-ups.  
**Aesthetic Direction:** Clean, editorial, dark-themed with a warm accent color. Feels like a premium SaaS product. Avoid generic purple gradients.

### Sections

| Section | Content |
|---|---|
| Hero | Headline + subline + CTA ("Get Started Free") + product screenshot/mockup |
| Features | 3-column feature highlights: Chat, Tasks, Mind Map |
| How It Works | 3-step flow: Create Org → Invite Team → Start Working |
| Testimonials | 3–4 sample user cards with avatar, name, role, short quote |
| Pricing teaser | "Free during beta" banner |
| Footer | Links: About, Docs, GitHub (placeholder), Login, Sign Up |

### Sample User Profiles (hardcoded)
```json
[
  { "name": "Riya Menon", "role": "Product Manager @ Zuri Labs", "avatar": "RM", "review": "Finally one place for our standups, tasks, and roadmap planning. The mind map to task link is a game changer." },
  { "name": "Arjun Pillai", "role": "Engineering Lead @ Stackd", "avatar": "AP", "review": "The Kanban + list hybrid view is exactly what our sprint reviews needed. Onboarded the team in under 20 minutes." },
  { "name": "Sneha Krishnan", "role": "Founder @ Pebble Studio", "avatar": "SK", "review": "As a small team we needed something that didn't feel like Jira. This hits the right balance of power and simplicity." },
  { "name": "Vikram Anand", "role": "Ops Lead @ Flux Co", "avatar": "VA", "review": "Group channels + task assignments in one sidebar changed how we run our weekly syncs." }
]
```

---

## 6. Authentication & Onboarding

### 6.1 Auth Screens
- **Login:** Email + Password. Firebase `signInWithEmailAndPassword`.
- **Register:** Name + Email + Password + Confirm Password. Firebase `createUserWithEmailAndPassword`.
- **Validation:** Client-side (Zod or manual). Error states on all fields.
- **No social auth in Phase 1.**

### 6.2 Organization Setup (Post-Register)
- Triggered immediately after first-time registration.
- Fields: Organization Name, (optional) Organization Logo upload placeholder
- On submit: creates `organizations/{orgId}` document in Firestore (Phase 2 live, Phase 1 local Zustand state)
- User is set as `owner` of the org.
- Single org per account in Phase 1. Multi-org support is Phase 2.

---

## 7. App Shell & Navigation

### Layout
**Slack-style left sidebar** — fixed, collapsible on mobile.

### Sidebar Sections

```
[Org Logo + Name]
[User Avatar + Name]

─── NAVIGATION ───
  🏠 Home / Dashboard (placeholder)
  
─── CHAT ───
  💬 Direct Messages
     ↳ [User list]
  # group-general
  # group-design
  + New Group

─── TASKS ───
  📋 Projects
     ↳ Project Alpha
     ↳ Project Beta
  + New Project

─── TOOLS ───
  🧠 Mind Maps
     ↳ [Map list]
  + New Map

─── BOTTOM ───
  ⚙️ Settings
  🔔 Notifications (badge)
  Logout
```

### Zustand: `useUIStore`
```ts
interface UIStore {
  sidebarOpen: boolean
  activeSectionId: string  // 'chat' | 'tasks' | 'mindmap'
  activeItemId: string     // dmId / groupId / projectId / mapId
  toggleSidebar: () => void
  setActiveSection: (section: string) => void
  setActiveItem: (id: string) => void
}
```

---

## 8. Chat Module

### 8.1 P2P Direct Messages
- User selects a team member from sidebar
- Opens a full-height message thread pane
- Messages: avatar, name, timestamp, message body
- Input bar: text input + send button (Enter to send)

### 8.2 Group Channels
- Org admin/owner can create named channels (e.g. `#general`, `#design`)
- Same UI as DM but shows channel name header

### 8.3 Message Data Model
```ts
interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  channelId: string   // dmId or groupId
  type: 'text'        // Phase 1: text only
}

interface Channel {
  id: string
  type: 'dm' | 'group'
  name?: string       // only for group
  members: string[]   // userIds
  lastMessage?: Message
  unreadCount: number
}
```

### Zustand: `useChatStore`
```ts
interface ChatStore {
  channels: Record<string, Channel>
  messages: Record<string, Message[]>   // channelId → messages
  activeChannelId: string | null
  sendMessage: (channelId: string, content: string) => void
  setActiveChannel: (id: string) => void
  createGroup: (name: string, members: string[]) => void
  markAsRead: (channelId: string) => void
}
```

**Phase 1:** All data is seeded mock data in Zustand. No Firestore writes.

---

## 9. Task Manager

### 9.1 Projects
- Multiple projects per org
- Each project has: name, description, color tag, status (active/archived)
- Selecting a project opens the task workspace

### 9.2 Task Hierarchy (5-level)
```
Epic
  └─ Feature
       └─ User Story
            └─ Task
                 └─ Sub-task
```
- Every item is a "task" document with a `type` field and optional `parentId`
- The list view renders this as an indented tree

### 9.3 Task Data Model
```ts
type TaskType = 'epic' | 'feature' | 'story' | 'task' | 'subtask'
type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done'
type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

interface Task {
  id: string
  projectId: string
  parentId?: string        // null = top-level
  type: TaskType
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: Date
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  linkedMindMapNodeId?: string   // Mind Map linkage
}
```

### 9.4 View Modes

#### Kanban View
- Columns: Backlog | To Do | In Progress | In Review | Done
- Draggable cards (react-beautiful-dnd or @dnd-kit)
- Card shows: title, type badge, priority color, assignee avatar, due date
- "+ Add Task" at bottom of each column

#### Table View
- Spreadsheet-like rows
- Columns: Type | Title | Status | Priority | Assignee | Due Date | Tags
- Inline editable cells (click to edit)
- Sortable columns, filterable by status/assignee/priority

#### Pie Chart View
- Tasks grouped by Status (donut chart) — primary
- Secondary toggle: group by Priority or by Type
- Use recharts or similar (Tailwind-compatible)
- Legend below chart with counts and percentages

#### List View (Tree)
- Hierarchical indent view
- Each row: chevron toggle (expand/collapse children) | type icon | title | status badge | assignee | due date
- Epics are top-level, collapsible to hide features/stories underneath
- Drag to re-parent (Phase 2)

### 9.5 Task Detail Panel
- Opens as right-side drawer or modal on task click
- Fields: Title (editable), Type, Status, Priority, Assignee, Due Date, Description (markdown), Linked Mind Map Node (clickable)
- Child tasks list (read-only, click to open)

### Zustand: `useTaskStore`
```ts
interface TaskStore {
  projects: Record<string, Project>
  tasks: Record<string, Task>          // taskId → Task
  activeProjectId: string | null
  activeView: 'kanban' | 'table' | 'list' | 'chart'
  selectedTaskId: string | null

  setActiveProject: (id: string) => void
  setView: (view: ActiveView) => void
  selectTask: (id: string | null) => void
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, newStatus: TaskStatus) => void   // Kanban drag
  getTasksByProject: (projectId: string) => Task[]
  getChildTasks: (parentId: string) => Task[]
}
```

---

## 10. Mind Map Module

### 10.1 Canvas
- Full-viewport canvas with pan and zoom
- Infinite canvas (or bounded large canvas)
- Nodes can be freely positioned (drag anywhere)

### 10.2 Nodes
```ts
interface MindMapNode {
  id: string
  mapId: string
  label: string
  x: number
  y: number
  color?: string      // node background color
  linkedTaskId?: string   // Task linkage
  parentNodeId?: string   // for tree-like structure edges
}

interface MindMapEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  label?: string
}

interface MindMap {
  id: string
  name: string
  orgId: string
  nodes: MindMapNode[]
  edges: MindMapEdge[]
  createdAt: Date
}
```

### 10.3 Interactions
- Double-click canvas → create new node at cursor position
- Click node → select (shows handle to drag)
- Drag node → reposition
- Hover node → show "Link to Task" button (opens task picker dropdown)
- Connect nodes → drag from node edge handle to another node (creates edge)
- Right-click node → context menu: Edit label | Change color | Delete | Link Task | Unlink Task

### 10.4 Task Linkage
- When a mind map node is linked to a task:
  - Node shows a small task-type badge icon overlay
  - Clicking badge opens the task detail panel (from Task module)
  - Task detail shows "Linked Node" field with map name + node label
- This linkage is bidirectional via `linkedTaskId` on node and `linkedMindMapNodeId` on task

### Zustand: `useMindMapStore`
```ts
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
```

---

## 11. Auth & User Store

### Zustand: `useAuthStore`
```ts
interface AuthStore {
  user: FirebaseUser | null
  profile: UserProfile | null
  orgId: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setOrg: (orgId: string) => void
}

interface UserProfile {
  uid: string
  name: string
  email: string
  avatarUrl?: string
  orgId: string
  role: 'owner' | 'admin' | 'member'
  createdAt: Date
}
```

---

## 12. Firebase Firestore Data Structure

```
/organizations/{orgId}
  name: string
  ownerId: string
  createdAt: timestamp
  members: string[]    // userIds

/users/{uid}
  name: string
  email: string
  avatarUrl: string
  orgId: string
  role: 'owner' | 'admin' | 'member'

/channels/{channelId}
  orgId: string
  type: 'dm' | 'group'
  name?: string
  members: string[]
  createdAt: timestamp

/channels/{channelId}/messages/{messageId}
  senderId: string
  content: string
  timestamp: timestamp

/projects/{projectId}
  orgId: string
  name: string
  description: string
  color: string
  status: 'active' | 'archived'

/tasks/{taskId}
  projectId: string
  orgId: string
  parentId: string | null
  type: TaskType
  title: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string | null
  dueDate: timestamp | null
  linkedMindMapNodeId: string | null

/mindmaps/{mapId}
  orgId: string
  name: string
  nodes: MindMapNode[]    // stored as array in doc (Phase 1 simplification)
  edges: MindMapEdge[]
```

---

## 13. Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOrgMember(orgId) {
      return isSignedIn() &&
        get(/databases/$(database)/documents/organizations/$(orgId)).data.members.hasAny([request.auth.uid]);
    }

    function isOrgOwner(orgId) {
      return isSignedIn() &&
        get(/databases/$(database)/documents/organizations/$(orgId)).data.ownerId == request.auth.uid;
    }

    match /organizations/{orgId} {
      allow read: if isOrgMember(orgId);
      allow create: if isSignedIn();
      allow update, delete: if isOrgOwner(orgId);
    }

    match /users/{uid} {
      allow read: if isSignedIn();
      allow write: if request.auth.uid == uid;
    }

    match /channels/{channelId} {
      allow read: if isSignedIn() &&
        resource.data.members.hasAny([request.auth.uid]);
      allow create: if isSignedIn();
      allow update: if isSignedIn() &&
        resource.data.members.hasAny([request.auth.uid]);

      match /messages/{messageId} {
        allow read: if isSignedIn() &&
          get(/databases/$(database)/documents/channels/$(channelId)).data.members.hasAny([request.auth.uid]);
        allow create: if isSignedIn() &&
          get(/databases/$(database)/documents/channels/$(channelId)).data.members.hasAny([request.auth.uid]);
        allow update, delete: if request.auth.uid == resource.data.senderId;
      }
    }

    match /projects/{projectId} {
      allow read, write: if isOrgMember(resource.data.orgId);
      allow create: if isSignedIn();
    }

    match /tasks/{taskId} {
      allow read, write: if isOrgMember(resource.data.orgId);
      allow create: if isSignedIn();
    }

    match /mindmaps/{mapId} {
      allow read, write: if isOrgMember(resource.data.orgId);
      allow create: if isSignedIn();
    }
  }
}
```

---

## 14. Component Library & Design Tokens

### UI Components (React Bits MCP)
Use React Bits MCP for: buttons, modals, drawers, dropdowns, badges, tooltips, avatars, tabs, inputs, cards, toasts.

### Icons (Lucide Icons)
Use Lucide Icons throughout. Key icons:
- `MessageSquare` — chat
- `CheckSquare`, `ListTodo` — tasks
- `GitBranch` or `Network` — mind map
- `LayoutKanban` — Kanban
- `Table2` — Table
- `List` — List
- `PieChart` — Chart
- `Plus`, `Trash2`, `Edit3`, `Link`, `Unlink` — actions
- `ChevronRight`, `ChevronDown` — tree toggles
- `Circle`, `Zap`, `BookOpen`, `Star`, `CornerDownRight` — task type icons

### Design Tokens
```css
--color-primary: #F97316;      /* warm orange accent */
--color-bg: #0F0F0F;           /* near-black base */
--color-surface: #1A1A1A;      /* card/panel surface */
--color-border: #2A2A2A;       /* subtle borders */
--color-text: #F5F5F5;         /* primary text */
--color-muted: #6B7280;        /* secondary text */
--color-success: #22C55E;
--color-warning: #EAB308;
--color-error: #EF4444;
```

**Font:** `Geist` (display) + `Geist Mono` (code/timestamps)  
**Radius:** `--radius: 8px` (cards), `4px` (badges)  
**Spacing base:** 4px grid

### Task Type Color Coding
| Type | Color |
|---|---|
| Epic | `#8B5CF6` (purple) |
| Feature | `#3B82F6` (blue) |
| Story | `#10B981` (green) |
| Task | `#F97316` (orange) |
| Subtask | `#6B7280` (gray) |

### Priority Color Coding
| Priority | Color |
|---|---|
| Critical | `#EF4444` |
| High | `#F97316` |
| Medium | `#EAB308` |
| Low | `#6B7280` |

---

## 15. Phase 1 Seed / Mock Data

The following mock data should be seeded into Zustand stores on app init (development mode).

### Users (mock org members)
```ts
[
  { uid: 'u1', name: 'Vignesh K', email: 'vignesh@Knot.app', role: 'owner' },
  { uid: 'u2', name: 'Riya Menon', email: 'riya@Knot.app', role: 'admin' },
  { uid: 'u3', name: 'Arjun Pillai', email: 'arjun@Knot.app', role: 'member' },
]
```

### Projects (mock)
```ts
[
  { id: 'p1', name: 'Mobile App Launch', color: '#8B5CF6', status: 'active' },
  { id: 'p2', name: 'Website Redesign', color: '#3B82F6', status: 'active' },
]
```

### Tasks (mock — Project p1)
Seed at least: 2 Epics, 2 Features per Epic, 2 Stories per Feature, 1–2 Tasks per Story. Cover all statuses across tasks.

### Channels (mock)
```ts
[
  { id: 'c1', type: 'group', name: 'general', members: ['u1','u2','u3'] },
  { id: 'c2', type: 'group', name: 'design', members: ['u1','u2'] },
  { id: 'dm-u1-u2', type: 'dm', members: ['u1','u2'] },
]
```

---

## 16. Phase 1 Non-Goals (Explicit Exclusions)

- No real-time sync (Firestore listeners)
- No file/image upload in chat
- No email invite flow
- No push notifications
- No mobile app (PWA or native)
- No role-based permission enforcement in UI (just data model)
- No search across chat/tasks
- No activity/audit log
- No dark/light theme toggle (dark only in Phase 1)

---

## 17. Agent Implementation Checklist

### Setup
- [ ] Next.js 14 App Router project scaffold
- [ ] Tailwind CSS configured with design tokens
- [ ] Firebase SDK configured (`firebaseConfig.ts`)
- [ ] Zustand installed, all store files created (auth, ui, chat, task, mindmap)
- [ ] React Bits MCP components integrated
- [ ] Lucide Icons installed

### Pages
- [ ] `/` — Landing page (hero, features, testimonials, footer)
- [ ] `/login` — Email + password login form
- [ ] `/register` — Registration form
- [ ] `/onboarding/create-org` — Org creation form
- [ ] `/app/[orgId]/chat/[channelId]` — Chat view
- [ ] `/app/[orgId]/tasks/[projectId]` — Task workspace (all 4 view tabs)
- [ ] `/app/[orgId]/mindmap/[mapId]` — Mind map canvas

### Components
- [ ] `<AppShell>` with sidebar
- [ ] `<Sidebar>` with nav sections
- [ ] `<ChatPanel>` + `<MessageBubble>` + `<MessageInput>`
- [ ] `<KanbanBoard>` + `<KanbanColumn>` + `<TaskCard>`
- [ ] `<TaskTable>` with inline edit
- [ ] `<TaskListTree>` with recursive indent
- [ ] `<TaskPieChart>`
- [ ] `<TaskDetailDrawer>`
- [ ] `<MindMapCanvas>` with node/edge rendering
- [ ] `<MindMapNode>` (draggable)
- [ ] `<TaskLinkPicker>` (dropdown for node → task linkage)

### State
- [ ] `useAuthStore` — full slice wired
- [ ] `useUIStore` — sidebar, active section/item
- [ ] `useChatStore` — channels, messages, mock seed
- [ ] `useTaskStore` — projects, tasks, mock seed, all CRUD ops
- [ ] `useMindMapStore` — maps, nodes, edges, task linkage

### Firebase
- [ ] `firestore.rules` written and deployable
- [ ] Data model documented in `firebase-schema.md`
- [ ] All collection paths match schema in Section 12

---

## 18. Future Phases (Reference Only)

| Phase | Feature |
|---|---|
| 2 | Live Firestore reads/writes + real-time listeners |
| 2 | Email invite flow + multi-org membership |
| 2 | File/image attachments in chat |
| 3 | Notifications (in-app + email via Firebase Functions) |
| 3 | Search across tasks and messages |
| 3 | Workflow automations (task status triggers) |
| 4 | Mobile-responsive / PWA |
| 4 | AI assistant (task summarization, meeting notes) |
