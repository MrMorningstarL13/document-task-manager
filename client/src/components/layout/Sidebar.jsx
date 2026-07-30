import { NavLink } from "react-router"
import {
  Hexagon,
  LayoutGrid,
  CheckSquare,
  Users,
  ScrollText,
  X,
} from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { cn } from "../../lib/utils"

const nav = [
  { to: "/app/projects", label: "Projects", icon: LayoutGrid },
  { to: "/app/tasks", label: "My Tasks", icon: CheckSquare },
]

const adminNav = [
  { to: "/app/users", label: "Users", icon: Users },
  { to: "/app/audit-logs", label: "Audit Logs", icon: ScrollText },
]

function Item({ to, label, icon: Icon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-active text-white"
            : "text-sidebar-foreground hover:bg-sidebar-active/60 hover:text-white",
        )
      }
    >
      <Icon className="h-[18px] w-[18px]" />
      {label}
    </NavLink>
  )
}

export function Sidebar({ open, onClose }) {
  const isAdmin = useAuthStore((s) => s.isAdmin())

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 fill-primary text-primary" />
            <span className="text-lg font-bold text-white">Hive</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-foreground hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Workspace
          </p>
          {nav.map((item) => (
            <Item key={item.to} {...item} onNavigate={onClose} />
          ))}

          {isAdmin && (
            <>
              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Admin
              </p>
              {adminNav.map((item) => (
                <Item key={item.to} {...item} onNavigate={onClose} />
              ))}
            </>
          )}
        </nav>

        <div className="px-5 py-4 text-xs text-sidebar-foreground/50">
          Hive Workspace v0.1
        </div>
      </aside>
    </>
  )
}
