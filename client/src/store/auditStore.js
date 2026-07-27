import { create } from "zustand"
import { auditService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.logs || res?.items || []
}

export const useAuditStore = create((set) => ({
  logs: [],
  loading: false,
  error: null,
  actionFilter: "ALL",

  setActionFilter: (actionFilter) => set({ actionFilter }),

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const res = await auditService.list()
      set({ logs: asArray(res), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  fetchByUser: async (userId) => {
    set({ loading: true, error: null })
    try {
      const res = await auditService.byUser(userId)
      set({ logs: asArray(res), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
