import { create } from "zustand"
import { projectService, userService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.projects || res?.items || []
}

export const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  view: "my", // "my" | "all"

  setView: (view) => set({ view }),

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const res = await projectService.list()
      set({ projects: asArray(res), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  fetchMine: async () => {
    set({ loading: true, error: null })
    try {
      const res = await projectService.listMine()
      set({ projects: asArray(res), loading: false })
    } catch (err) {
      // fall back to the users/me/projects endpoint if /projects/my is missing
      try {
        const res = await userService.myProjects()
        set({ projects: asArray(res), loading: false })
      } catch (err2) {
        set({ error: err2.message, loading: false })
      }
    }
  },

  create: async (payload) => {
    const created = await projectService.create(payload)
    const project = created?.data || created?.project || created
    set({ projects: [project, ...get().projects] })
    return project
  },

  update: async (projectId, payload) => {
    const updated = await projectService.update(projectId, payload)
    const project = updated?.data || updated?.project || updated
    set({
      projects: get().projects.map((p) =>
        (p.id || p._id) === projectId ? { ...p, ...project } : p,
      ),
    })
    return project
  },

  remove: async (projectId) => {
    await projectService.remove(projectId)
    set({
      projects: get().projects.filter((p) => (p.id || p._id) !== projectId),
    })
  },

  addMember: async (projectId, payload) => {
    const res = await projectService.addMember(projectId, payload)
    return res?.data || res
  },
}))
