import { useEffect, useState } from "react"
import { Users as UsersIcon, Search, ScrollText } from "lucide-react"
import { Link } from "react-router"
import { useUserStore } from "../store/userStore"
import { PageHeader } from "../components/layout/PageHeader"
import { PageLoader, EmptyState, ErrorBanner, Avatar } from "../components/ui/Misc"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Select, Input } from "../components/ui/Field"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { getId, displayName, isActiveUser, label, USER_ROLES } from "../lib/entities"

export default function UsersPage() {
  const { users, loading, error, fetchAll, setRole, deactivate } = useUserStore()
  const [query, setQuery] = useState("")
  const [toDeactivate, setToDeactivate] = useState(null)
  const [working, setWorking] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const filtered = users.filter((u) => {
    const q = query.toLowerCase()
    return (
      displayName(u).toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    )
  })

  const confirmDeactivate = async () => {
    setWorking(true)
    try {
      await deactivate(getId(toDeactivate))
      setToDeactivate(null)
    } finally {
      setWorking(false)
    }
  }

  return (
    <div>
      <PageHeader title="Users" description="Manage team members, roles, and access.">
        <Button as={Link} to="/app/audit-logs" variant="secondary">
          <ScrollText className="h-4 w-4" /> Audit logs
        </Button>
      </PageHeader>

      <div className="mb-5 sm:w-72">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <ErrorBanner message={error} className="mb-4" />

      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span className="col-span-5">User</span>
            <span className="col-span-3">Role</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((u) => {
              const id = getId(u)
              const active = isActiveUser(u)
              return (
                <li
                  key={id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-12 md:items-center md:gap-4"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar name={displayName(u)} />
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">
                        {displayName(u)}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <Select
                      className="w-36"
                      value={u.role || "USER"}
                      onChange={(e) => setRole(id, e.target.value)}
                      disabled={!active}
                    >
                      {USER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {label(r)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-span-2">
                    {active ? (
                      <Badge tone="success">Active</Badge>
                    ) : (
                      <Badge tone="danger">Inactive</Badge>
                    )}
                  </div>
                  <div className="col-span-2 flex md:justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!active}
                      onClick={() => setToDeactivate(u)}
                    >
                      Deactivate
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={!!toDeactivate}
        onClose={() => setToDeactivate(null)}
        onConfirm={confirmDeactivate}
        loading={working}
        title="Deactivate user"
        message={`Deactivate ${displayName(toDeactivate)}? They will lose access until reactivated.`}
        confirmLabel="Deactivate"
      />
    </div>
  )
}
