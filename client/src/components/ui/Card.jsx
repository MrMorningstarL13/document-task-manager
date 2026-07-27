import { cn } from "../../lib/utils"

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn("border-b border-border px-5 py-4", className)}>{children}</div>
}

export function CardBody({ className, children }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("text-base font-semibold text-foreground", className)}>{children}</h3>
}
