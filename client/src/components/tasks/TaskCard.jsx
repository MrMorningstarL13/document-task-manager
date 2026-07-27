import { Calendar, Pencil, Trash2 } from "lucide-react"
import { Badge, toneForPriority } from "../ui/Badge"
import { Avatar } from "../ui/Misc"
import { formatDate, cn } from "../../lib/utils"
import { displayName, label } from "../../lib/entities"

export function TaskCard({ task, onEdit, onDelete, canManage = true }) {
  const assignee = task.assignee || task.assignedTo
  const overdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    String(task.status).toUpperCase() !== "DONE"

  return (
    <div className="group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-foreground">{task.title}</p>
        {canManage && (
          <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit?.(task)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete?.(task)}
              className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge tone={toneForPriority(task.priority)}>{label(task.priority)}</Badge>
          {task.deadline && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                overdue ? "font-medium text-danger" : "text-muted-foreground",
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(task.deadline)}
            </span>
          )}
        </div>
        {assignee && <Avatar name={displayName(assignee)} size="sm" />}
      </div>
    </div>
  )
}
