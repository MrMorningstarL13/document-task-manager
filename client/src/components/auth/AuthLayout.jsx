import { Hexagon } from "lucide-react"

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-full">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-sidebar p-12 lg:flex">
        <div className="flex items-center gap-2 text-primary">
          <Hexagon className="h-7 w-7 fill-primary" />
          <span className="text-xl font-bold tracking-tight text-white">Hive</span>
        </div>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white text-balance">
            The workspace where your team&apos;s work comes together.
          </h1>
          <p className="mt-4 max-w-md text-sidebar-foreground leading-relaxed">
            Plan projects, manage tasks on boards, and collaborate on documents — all
            in one focused home for your team.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Projects", "Task boards", "Documents"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-4 text-sm font-medium text-sidebar-foreground"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Hexagon className="h-6 w-6 fill-primary text-primary" />
            <span className="text-lg font-bold">Hive</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
