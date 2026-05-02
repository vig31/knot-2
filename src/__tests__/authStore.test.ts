import { useAuthStore } from '@/stores/authStore'
import { mockUsers, mockOrg } from '@/data/mockData'

beforeEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState())
})

describe('authStore', () => {
  describe('initial state', () => {
    it('starts with the first mock user logged in', () => {
      const { user } = useAuthStore.getState()
      expect(user).toEqual(mockUsers[0])
    })

    it('starts with the mock org id', () => {
      const { orgId } = useAuthStore.getState()
      expect(orgId).toBe(mockOrg.id)
    })
  })

  describe('login', () => {
    it('sets user matching the provided email', () => {
      const { login } = useAuthStore.getState()
      login('riya@knot.app', 'password')

      const { user } = useAuthStore.getState()
      expect(user?.email).toBe('riya@knot.app')
      expect(user?.uid).toBe('u2')
    })

    it('clears any previous error on successful login', () => {
      useAuthStore.setState({ error: 'previous error' })
      const { login } = useAuthStore.getState()
      login('riya@knot.app', 'password')

      expect(useAuthStore.getState().error).toBeNull()
    })

    it('falls back to first mock user for unknown email', () => {
      const { login } = useAuthStore.getState()
      login('unknown@example.com', 'password')

      const { user } = useAuthStore.getState()
      expect(user).toEqual(mockUsers[0])
    })
  })

  describe('register', () => {
    it('creates a new user with provided name and email', () => {
      const { register } = useAuthStore.getState()
      register('Test User', 'test@example.com', 'password')

      const { user } = useAuthStore.getState()
      expect(user?.name).toBe('Test User')
      expect(user?.email).toBe('test@example.com')
      expect(user?.role).toBe('owner')
    })

    it('assigns a unique uid with timestamp prefix', () => {
      const { register } = useAuthStore.getState()
      register('Alice', 'alice@example.com', 'pw')

      const { user } = useAuthStore.getState()
      expect(user?.uid).toMatch(/^u\d+/)
    })
  })

  describe('logout', () => {
    it('clears user and orgId', () => {
      const { logout } = useAuthStore.getState()
      logout()

      const { user, orgId } = useAuthStore.getState()
      expect(user).toBeNull()
      expect(orgId).toBeNull()
    })
  })

  describe('setOrg', () => {
    it('updates orgId', () => {
      const { setOrg } = useAuthStore.getState()
      setOrg('org-new')

      expect(useAuthStore.getState().orgId).toBe('org-new')
    })
  })
})
