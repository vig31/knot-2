import { useTaskStore } from '@/stores/taskStore'

// Reset store to fresh state before each test
beforeEach(() => {
  useTaskStore.setState(useTaskStore.getInitialState())
})

describe('taskStore', () => {
  describe('createTask', () => {
    it('adds a new task to the store', () => {
      const { createTask, tasks } = useTaskStore.getState()
      const before = Object.keys(tasks).length

      createTask({
        projectId: 'p1',
        type: 'task',
        title: 'New test task',
        status: 'todo',
        priority: 'medium',
      })

      const after = Object.keys(useTaskStore.getState().tasks).length
      expect(after).toBe(before + 1)
    })

    it('assigns an id, createdAt, and updatedAt', () => {
      const { createTask } = useTaskStore.getState()
      createTask({
        projectId: 'p1',
        type: 'task',
        title: 'Timed task',
        status: 'todo',
        priority: 'low',
      })

      const allTasks = Object.values(useTaskStore.getState().tasks)
      const newTask = allTasks.find((t) => t.title === 'Timed task')
      expect(newTask).toBeDefined()
      expect(newTask!.id).toMatch(/^t-/)
      expect(newTask!.createdAt).toBeInstanceOf(Date)
      expect(newTask!.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('updateTask', () => {
    it('patches task fields and updates updatedAt', () => {
      const { updateTask } = useTaskStore.getState()
      const before = useTaskStore.getState().tasks['t1']
      const prevUpdatedAt = before.updatedAt

      // Small delay to ensure timestamp differs
      jest.useFakeTimers()
      jest.advanceTimersByTime(1000)
      updateTask('t1', { title: 'Updated Title', priority: 'low' })
      jest.useRealTimers()

      const updated = useTaskStore.getState().tasks['t1']
      expect(updated.title).toBe('Updated Title')
      expect(updated.priority).toBe('low')
      expect(updated.updatedAt.getTime()).toBeGreaterThan(prevUpdatedAt.getTime())
    })

    it('does not affect other tasks', () => {
      const { updateTask } = useTaskStore.getState()
      const t2Before = { ...useTaskStore.getState().tasks['t2'] }

      updateTask('t1', { title: 'Changed' })

      const t2After = useTaskStore.getState().tasks['t2']
      expect(t2After.title).toBe(t2Before.title)
    })
  })

  describe('deleteTask', () => {
    it('removes the task from the store', () => {
      const { deleteTask } = useTaskStore.getState()
      expect(useTaskStore.getState().tasks['t1']).toBeDefined()

      deleteTask('t1')

      expect(useTaskStore.getState().tasks['t1']).toBeUndefined()
    })

    it('does not remove other tasks', () => {
      const { deleteTask } = useTaskStore.getState()
      const before = Object.keys(useTaskStore.getState().tasks).length

      deleteTask('t1')

      const after = Object.keys(useTaskStore.getState().tasks).length
      expect(after).toBe(before - 1)
    })
  })

  describe('moveTask', () => {
    it('changes task status', () => {
      const { moveTask } = useTaskStore.getState()
      expect(useTaskStore.getState().tasks['t9'].status).toBe('todo')

      moveTask('t9', 'in_progress')

      expect(useTaskStore.getState().tasks['t9'].status).toBe('in_progress')
    })
  })

  describe('getTasksByProject', () => {
    it('returns only tasks belonging to the given project', () => {
      const { getTasksByProject } = useTaskStore.getState()
      const p1Tasks = getTasksByProject('p1')
      const p2Tasks = getTasksByProject('p2')

      expect(p1Tasks.every((t) => t.projectId === 'p1')).toBe(true)
      expect(p2Tasks.every((t) => t.projectId === 'p2')).toBe(true)
      expect(p1Tasks.length + p2Tasks.length).toBe(Object.keys(useTaskStore.getState().tasks).length)
    })

    it('returns empty array for unknown project', () => {
      const { getTasksByProject } = useTaskStore.getState()
      expect(getTasksByProject('nonexistent')).toEqual([])
    })
  })

  describe('getChildTasks', () => {
    it('returns tasks with matching parentId', () => {
      const { getChildTasks } = useTaskStore.getState()
      const children = getChildTasks('t1')

      expect(children.length).toBeGreaterThan(0)
      expect(children.every((t) => t.parentId === 't1')).toBe(true)
    })

    it('returns empty array when no children exist', () => {
      const { getChildTasks } = useTaskStore.getState()
      expect(getChildTasks('nonexistent-parent')).toEqual([])
    })
  })

  describe('setView', () => {
    it('updates activeView', () => {
      const { setView } = useTaskStore.getState()
      expect(useTaskStore.getState().activeView).toBe('kanban')

      setView('table')

      expect(useTaskStore.getState().activeView).toBe('table')
    })
  })

  describe('selectTask', () => {
    it('sets selectedTaskId', () => {
      const { selectTask } = useTaskStore.getState()
      expect(useTaskStore.getState().selectedTaskId).toBeNull()

      selectTask('t3')
      expect(useTaskStore.getState().selectedTaskId).toBe('t3')

      selectTask(null)
      expect(useTaskStore.getState().selectedTaskId).toBeNull()
    })
  })
})
