import { create } from "zustand"
import { userService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.users || res?.items || []
}

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const res = await userService.getAll()
      set({ users: asArray(res), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  setRole: async (id, role) => {
    const updated = await userService.setRole(id, role)
    const user = updated?.data || updated?.user || null
    set({
      users: get().users.map((u) =>
        (u.id || u._id) === id ? { ...u, ...(user || { role }) } : u,
      ),
    })
  },

  deactivate: async (id) => {
    await userService.deactivate(id)
    set({
      users: get().users.map((u) =>
        (u.id || u._id) === id ? { ...u, active: false, isActive: false } : u,
      ),
    })
  },
}))
