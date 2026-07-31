import { useEffect, useMemo, useState } from "react"
import { ScrollText, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuditLogList, useAuditLogActions } from "../hooks/auditHooks"
import { PageHeader } from "../components/layout/PageHeader"
import { PageLoader, EmptyState, ErrorBanner, Avatar } from "../components/ui/Misc"
import { Card } from "../components/ui/Card"
import { Badge, toneForStatus } from "../components/ui/Badge"
import { Select, Input } from "../components/ui/Field"
import { Button } from "../components/ui/Button"
import { getId, displayName, label } from "../lib/entities"
import { formatDateTime } from "../lib/utils"

function actorName(log) {
  const u = log.user || log.actor || log.performedBy
  if (u) return displayName(u)
  return log.userName || log.userEmail || "System"
}

function actionOf(log) {
  return log.action || log.event || log.type || "ACTION"
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(0)
  const [actionFilter, setActionFilter] = useState("ALL")
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    // Reset to page 0 when filters change
    setPage(0)
  }, [actionFilter, debouncedQuery])

  const { data = {}, isLoading: loading, error } = useAuditLogList({ 
    page, 
    size: 20, 
    action: actionFilter, 
    search: debouncedQuery 
  })
  
  const { data: serverActions = [] } = useAuditLogActions()

  const { items: logs = [], pageNumber = 0, totalPages = 0 } = data

  const actions = useMemo(() => {
    return ["ALL", ...serverActions]
  }, [serverActions])

  return (
    <div>
      <PageHeader title="Audit Logs" description="A record of important actions across the workspace." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          className="sm:w-52"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          {actions.map((a) => (
            <option key={a} value={a}>
              {a === "ALL" ? "All actions" : label(a)}
            </option>
          ))}
        </Select>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <ErrorBanner message={error} className="mb-4" />

      {loading ? (
        <PageLoader />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No audit logs"
          description="Activity across the workspace will appear here."
        />
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <ul className="divide-y divide-border">
              {logs.map((log, i) => {
                const details = log.details || log.description || log.message
                return (
                  <li key={getId(log) || i} className="flex items-start gap-3 px-5 py-4">
                    <Avatar name={actorName(log)} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {actorName(log)}
                        </span>
                        <Badge tone={toneForStatus(actionOf(log))}>{label(actionOf(log))}</Badge>
                      </div>
                      {details && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {typeof details === "string" ? details : JSON.stringify(details)}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDateTime(log.createdAt || log.timestamp || log.date)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                Page {pageNumber + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={pageNumber === 0} 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={pageNumber >= totalPages - 1} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

