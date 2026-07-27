import { create } from "zustand"
import { taskService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.tasks || res?.items || []
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filters: { status: "ALL", priority: "ALL", mine: false },

  setFilters: (patch) => set({ filters: { ...get().filters, ...patch } }),

  fetch: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const { mine } = get().filters
      const res = mine
        ? await taskService.listMine(projectId)
        : await taskService.list(projectId)
      set({ tasks: asArray(res), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  create: async (projectId, payload) => {
    const created = await taskService.create(projectId, payload)
    const task = created?.data || created?.task || created
    set({ tasks: [task, ...get().tasks] })
    return task
  },

  update: async (projectId, taskId, payload) => {
    const updated = await taskService.update(projectId, taskId, payload)
    const task = updated?.data || updated?.task || updated
    set({
      tasks: get().tasks.map((t) =>
        (t.id || t._id) === taskId ? { ...t, ...task } : t,
      ),
    })
    return task
  },

  remove: async (projectId, taskId) => {
    await taskService.remove(projectId, taskId)
    set({ tasks: get().tasks.filter((t) => (t.id || t._id) !== taskId) })
  },

  reset: () => set({ tasks: [], filters: { status: "ALL", priority: "ALL", mine: false } }),
}))
