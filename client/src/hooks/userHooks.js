import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.users || res?.items || []
}

export function useUserList() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await userService.getAll()
      return asArray(res)
    },
  })
}

export function useSetUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await userService.setRole(id, role)
      return res?.data || res?.user || res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const res = await userService.deactivate(id)
      return res?.data || res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
