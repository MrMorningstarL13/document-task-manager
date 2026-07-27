import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Menu, ChevronDown, User, LogOut } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { Avatar } from "../ui/Misc"
import { Badge as StatusBadge } from "../ui/Badge"

export function Topbar({ onMenu }) {
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuthStore()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const name = user?.name || user?.email || "User"

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
        >
          <Avatar name={name} size="sm" />
          <span className="hidden text-sm font-medium text-foreground sm:block">{name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                {isAdmin() && <StatusBadge tone="primary">Admin</StatusBadge>}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="p-1">
              <Link
                to="/app/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                <User className="h-4 w-4" /> Profile
              </Link>
              <button
                onClick={() => {
                  logout()
                  navigate("/login")
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
