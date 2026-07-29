import { cn } from "../../lib/utils"

const tones = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-[#8a6d00]",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-[#b45309]",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
}

// Map common status/priority strings to a color tone.
export function toneForStatus(value = "") {
  const v = String(value).toUpperCase()
  if (["ACTIVE", "DONE", "COMPLETED", "OPEN"].includes(v)) return "success"
  if (["IN_PROGRESS", "IN PROGRESS", "PENDING", "REVIEW"].includes(v)) return "info"
  if (["ON_HOLD", "PAUSED", "BACKLOG"].includes(v)) return "warning"
  if (["ARCHIVED", "DELETED", "CLOSED", "CANCELLED", "INACTIVE"].includes(v)) return "danger"
  return "neutral"
}

export function toneForPriority(value = "") {
  const v = String(value).toUpperCase()
  if (["HIGH", "URGENT", "CRITICAL"].includes(v)) return "danger"
  if (["MEDIUM", "NORMAL"].includes(v)) return "warning"
  if (["LOW"].includes(v)) return "info"
  return "neutral"
}

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
