import { create } from "zustand"
import { documentService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.documents || res?.items || []
}

export const useDocumentStore = create((set, get) => ({
  documents: [],
  loading: false,
  error: null,

  fetch: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const res = await documentService.list(projectId)
      set({ documents: asArray(res), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  upload: async (projectId, file) => {
    const formData = new FormData()
    formData.append("file", file)
    const created = await documentService.upload(projectId, formData)
    const doc = created?.data || created?.document || created
    if (doc) set({ documents: [doc, ...get().documents] })
    return doc
  },

  remove: async (projectId, documentId) => {
    await documentService.remove(projectId, documentId)
    set({
      documents: get().documents.filter((d) => (d.id || d._id) !== documentId),
    })
  },

  download: async (projectId, doc) => {
    const documentId = doc.id || doc._id
    const res = await documentService.download(projectId, documentId)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name || doc.filename || `document-${documentId}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  reset: () => set({ documents: [] }),
}))
