import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { documentService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.documents || res?.items || []
}

export function useDocumentList(projectId) {
  return useQuery({
    queryKey: ["documents", projectId],
    queryFn: async () => {
      if (!projectId) return []
      const res = await documentService.list(projectId)
      return asArray(res)
    },
    enabled: !!projectId,
  })
}

export function useUploadDocument(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      const res = await documentService.upload(projectId, formData)
      return res?.data || res?.document || res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] })
    },
  })
}

export function useDeleteDocument(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (documentId) => {
      await documentService.remove(projectId, documentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] })
    },
  })
}

export function useDownloadDocument(projectId) {
  return useMutation({
    mutationFn: async (doc) => {
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
  })
}
