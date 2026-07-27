// Defensive accessors so the UI works regardless of the backend's exact field
// naming (id vs _id, owner object vs ownerName, etc.).

export const getId = (obj) => obj?.id ?? obj?._id ?? obj?.uuid ?? null

export function ownerName(project) {
  const o = project?.owner
  if (typeof o === "string") return o
  return o?.name || o?.email || project?.ownerName || project?.createdBy?.name || "—"
}

export function memberCount(project) {
  if (typeof project?.memberCount === "number") return project.memberCount
  if (Array.isArray(project?.members)) return project.members.length
  if (Array.isArray(project?.users)) return project.users.length
  return 0
}

export function memberList(project) {
  if (Array.isArray(project?.members)) return project.members
  if (Array.isArray(project?.users)) return project.users
  return []
}

export function displayName(user) {
  return user?.name || user?.fullName || user?.username || user?.email || "Unknown"
}

export function isActiveUser(user) {
  if (typeof user?.active === "boolean") return user.active
  if (typeof user?.isActive === "boolean") return user.isActive
  if (user?.status) return String(user.status).toUpperCase() === "ACTIVE"
  return true
}

export const PROJECT_STATUSES = ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]
export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"]
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"]
export const USER_ROLES = ["USER", "ADMIN"]

export function label(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
