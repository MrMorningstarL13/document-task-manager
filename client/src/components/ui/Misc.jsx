import { cn } from "../../lib/utils"
import { initials } from "../../lib/utils"

export function Spinner({ className }) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-primary",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="h-7 w-7" />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorBanner({ message, className }) {
  if (!message) return null
  return (
    <div
      className={cn(
        "rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-medium text-danger",
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  )
}

const avatarColors = [
  "bg-[#f2b705] text-[#1a1d24]",
  "bg-info text-white",
  "bg-success text-white",
  "bg-accent text-white",
  "bg-danger text-white",
]

export function Avatar({ name = "", size = "md", className }) {
  const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" }
  const idx = (name.charCodeAt(0) || 0) % avatarColors.length
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        avatarColors[idx],
        sizes[size],
        className,
      )}
      title={name}
    >
      {initials(name) || "?"}
    </span>
  )
}
