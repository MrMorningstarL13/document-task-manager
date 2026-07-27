import { create } from "zustand"
import { authService, userService } from "../lib/services"
import { getToken, setToken } from "../lib/api"

function extractToken(res) {
  return res?.token || res?.accessToken || res?.access_token || res?.jwt || null
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken(),
  loading: false,
  initializing: true,
  error: null,

  isAdmin: () => {
    const role = get().user?.role
    return role === "ADMIN" || role === "admin"
  },

  clearError: () => set({ error: null }),

  // Load the current user from a stored token on app boot.
  init: async () => {
    const token = getToken()
    if (!token) {
      set({ initializing: false })
      return
    }
    try {
      const user = await userService.me()
      set({ user, token, initializing: false })
    } catch {
      setToken(null)
      set({ user: null, token: null, initializing: false })
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const res = await authService.login(credentials)
      const token = extractToken(res)
      if (token) setToken(token)
      const user = res?.user || (await userService.me())
      set({ user, token, loading: false })
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null })
    try {
      const res = await authService.register(payload)
      const token = extractToken(res)
      if (token) {
        setToken(token)
        const user = res?.user || (await userService.me())
        set({ user, token, loading: false })
        return { ok: true, autoLoggedIn: true }
      }
      set({ loading: false })
      return { ok: true, autoLoggedIn: false }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { ok: false }
    }
  },

  updateProfile: async (payload) => {
    const user = await userService.updateMe(payload)
    set({ user })
    return user
  },

  logout: () => {
    setToken(null)
    set({ user: null, token: null })
  },
}))
