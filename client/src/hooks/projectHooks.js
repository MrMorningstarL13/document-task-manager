import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { projectService, userService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.projects || res?.items || []
}

export function useProjectList(view = "my") {
  return useQuery({
    queryKey: ["projects", view],
    queryFn: async () => {
      if (view === "all") {
        const res = await projectService.list()
        return asArray(res)
      }
      try {
        const res = await projectService.listMine()
        return asArray(res)
      } catch {
        const res = await userService.myProjects()
        return asArray(res)
      }
    },
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const res = await projectService.create(payload)
      return res?.data || res?.project || res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, payload }) => {
      const res = await projectService.update(projectId, payload)
      return res?.data || res?.project || res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (projectId) => {
      await projectService.remove(projectId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useAddProjectMember(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const res = await projectService.addMember(projectId, payload)
      return res?.data || res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
