import { cn } from "../../lib/utils"

const baseControl =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition disabled:opacity-60"

export function Label({ className, children, ...props }) {
  return (
    <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props}>
      {children}
    </label>
  )
}

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(baseControl, error && "border-danger focus:ring-danger", className)}
      {...props}
    />
  )
}

export function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(baseControl, "min-h-24 resize-y", error && "border-danger focus:ring-danger", className)}
      {...props}
    />
  )
}

export function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(baseControl, "appearance-none pr-8", error && "border-danger focus:ring-danger", className)}
      {...props}
    >
      {children}
    </select>
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return <p className="mt-1 text-xs font-medium text-danger">{children}</p>
}

export function Field({ label, error, htmlFor, children }) {
  return (
    <div>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      <FieldError>{error}</FieldError>
    </div>
  )
}
