import { api } from "./api"

// Thin wrappers around the backend API mapping. Keeping them here means the
// Zustand stores never hard-code URL strings.

export const authService = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
}

export const userService = {
  me: () => api.get("/api/users/me"),
  updateMe: (payload) => api.patch("/api/users/me", payload),
  myProjects: () => api.get("/api/users/me/projects"),
  // admin
  getAll: () => api.get("/api/users/admin/getAll"),
  setRole: (id, role) => api.put(`/api/users/admin/${id}/role`, { role }),
  deactivate: (id) => api.put(`/api/users/admin/${id}/deactivate`, {}),
}

export const projectService = {
  list: () => api.get("/api/projects"),
  listMine: () => api.get("/api/projects/my"),
  create: (payload) => api.post("/api/projects", payload),
  update: (projectId, payload) => api.patch(`/api/projects/${projectId}`, payload),
  remove: (projectId) => api.delete(`/api/projects/${projectId}`),
  addMember: (projectId, payload) =>
    api.post(`/api/projects/${projectId}/members`, payload),
}

export const taskService = {
  list: (projectId, { status, priority } = {}) => {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    if (priority) params.append("priority", priority)
    const query = params.toString()
    return api.get(`/api/projects/${projectId}/tasks${query ? `?${query}` : ""}`)
  },
  listMine: (projectId) => api.get(`/api/projects/${projectId}/tasks/my`),
  create: (projectId, payload) => api.post(`/api/projects/${projectId}/tasks`, payload),
  update: (projectId, taskId, payload) =>
    api.patch(`/api/projects/${projectId}/tasks/${taskId}`, payload),
  remove: (projectId, taskId) =>
    api.delete(`/api/projects/${projectId}/tasks/${taskId}`),
}

export const documentService = {
  list: (projectId) => api.get(`/api/projects/${projectId}/documents`),
  upload: (projectId, formData) =>
    api.post(`/api/projects/${projectId}/documents`, formData),
  remove: (projectId, documentId) =>
    api.delete(`/api/projects/${projectId}/documents/${documentId}`),
  download: (projectId, documentId) =>
    api.raw(`/api/projects/${projectId}/documents/${documentId}/download`),
}

export const auditService = {
  list: ({ page = 0, size = 20, action, search } = {}) => {
    const params = new URLSearchParams({ page, size })
    if (action && action !== "ALL") params.append("action", action)
    if (search) params.append("search", search)
    return api.get(`/api/admin/audit-logs?${params.toString()}`)
  },
  byUser: (userId, { page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams({ page, size })
    return api.get(`/api/admin/audit-logs/users/${userId}?${params.toString()}`)
  },
  actions: () => api.get("/api/admin/audit-logs/actions"),
}
