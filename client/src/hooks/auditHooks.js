import { useQuery } from "@tanstack/react-query"
import { auditService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.logs || res?.items || []
}

export function useAuditLogList(params = {}) {
  const { userId, page, size, action, search } = params
  return useQuery({
    queryKey: ["audit-logs", userId, page, size, action, search],
    queryFn: async () => {
      const res = userId
        ? await auditService.byUser(userId, { page, size })
        : await auditService.list({ page, size, action, search })
      
      return {
        items: asArray(res),
        pageNumber: res?.pageNumber || 0,
        pageSize: res?.pageSize || 20,
        totalPages: res?.totalPages || 0,
        totalElements: res?.totalElements || 0,
        isLast: res?.isLast ?? true,
      }
    },
    keepPreviousData: true,
  })
}

export function useAuditLogActions() {
  return useQuery({
    queryKey: ["audit-log-actions"],
    queryFn: async () => {
      const res = await auditService.actions()
      return asArray(res)
    },
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  })
}
