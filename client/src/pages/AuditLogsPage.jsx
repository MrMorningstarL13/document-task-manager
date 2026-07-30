import { useMemo, useState } from "react"
import { ScrollText, Search } from "lucide-react"
import { useAuditLogList } from "../hooks/auditHooks"
import { PageHeader } from "../components/layout/PageHeader"
import { PageLoader, EmptyState, ErrorBanner, Avatar } from "../components/ui/Misc"
import { Card } from "../components/ui/Card"
import { Badge, toneForStatus } from "../components/ui/Badge"
import { Select, Input } from "../components/ui/Field"
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
  const { data: logs = [], isLoading: loading, error } = useAuditLogList()
  const [actionFilter, setActionFilter] = useState("ALL")
  const [query, setQuery] = useState("")

  const actions = useMemo(() => {
    const set = new Set(logs.map(actionOf).filter(Boolean))
    return ["ALL", ...Array.from(set)]
  }, [logs])

  const filtered = logs.filter((log) => {
    const actionOk = actionFilter === "ALL" || actionOf(log) === actionFilter
    const q = query.toLowerCase()
    const searchOk =
      !q ||
      actorName(log).toLowerCase().includes(q) ||
      actionOf(log).toLowerCase().includes(q) ||
      JSON.stringify(log.details || log.metadata || {}).toLowerCase().includes(q)
    return actionOk && searchOk
  })

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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No audit logs"
          description="Activity across the workspace will appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {filtered.map((log, i) => {
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
      )}
    </div>
  )
}
