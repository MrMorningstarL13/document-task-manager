import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { taskService } from "../lib/services"

const taskQueryKey = (projectId, filters) => ["tasks", projectId, filters?.mine, filters?.status, filters?.priority]

export function useTaskList(projectId, filters) {
  return useQuery({
    queryKey: taskQueryKey(projectId, filters),
    queryFn: () => {
      if (filters?.mine) {
        return taskService.listMine(projectId)
      }
      return taskService.list(projectId, {
        status: filters?.status !== "ALL" ? filters?.status : undefined,
        priority: filters?.priority !== "ALL" ? filters?.priority : undefined,
      })
    },
    enabled: !!projectId,
    keepPreviousData: true,
  })
}

export function useCreateTask(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => taskService.create(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false })
    },
  })
}

export function useUpdateTask(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, payload }) => taskService.update(projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false })
    },
  })
}

export function useDeleteTask(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId) => taskService.remove(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false })
    },
  })
}
