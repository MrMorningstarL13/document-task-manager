import { useQuery } from "@tanstack/react-query"
import { auditService } from "../lib/services"

function asArray(res) {
  if (Array.isArray(res)) return res
  return res?.data || res?.logs || res?.items || []
}

export function useAuditLogList(userId = null) {
  return useQuery({
    queryKey: ["audit-logs", userId],
    queryFn: async () => {
      const res = userId
        ? await auditService.byUser(userId)
        : await auditService.list()
      return asArray(res)
    },
  })
}
