import { useMemo, useState } from "react"
import { Plus, LayoutGrid, List } from "lucide-react"
import { useCreateTask, useDeleteTask, useTaskList, useUpdateTask } from "../../lib/taskHooks"
import { Button } from "../ui/Button"
import { Select } from "../ui/Field"
import { PageLoader, EmptyState, ErrorBanner } from "../ui/Misc"
import { Badge, toneForStatus } from "../ui/Badge"
import { TaskCard } from "./TaskCard"
import { TaskFormModal } from "./TaskFormModal"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { TASK_STATUSES, TASK_PRIORITIES, label, getId } from "../../lib/entities"
import { cn } from "../../lib/utils"

export function TaskBoard({ projectId, members = [], canManage = true }) {
  const [layout, setLayout] = useState("board")
  const [modal, setModal] = useState({ open: false, task: null })
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [filters, setFilters] = useState({ status: "ALL", priority: "ALL", mine: false })

  const taskList = useTaskList(projectId, filters)
  const createTask = useCreateTask(projectId)
  const updateTask = useUpdateTask(projectId)
  const deleteTask = useDeleteTask(projectId)

  const visible = useMemo(() => {
    const tasks = taskList.data || []
    return tasks.filter((t) => {
      const statusOk = filters.status === "ALL" || t.status === filters.status
      const prioOk = filters.priority === "ALL" || t.priority === filters.priority
      return statusOk && prioOk
    })
  }, [taskList.data, filters])

  const handleSubmit = async (payload) => {
    if (modal.task) {
      await updateTask.mutateAsync({ taskId: getId(modal.task), payload })
    } else {
      await createTask.mutateAsync(payload)
    }
    setModal({ open: false, task: null })
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteTask.mutateAsync(getId(toDelete))
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            className="w-auto"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="ALL">All statuses</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </Select>
          <Select
            className="w-auto"
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
          >
            <option value="ALL">All priorities</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {label(p)}
              </option>
            ))}
          </Select>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#f2b705]"
              checked={filters.mine}
              onChange={(e) => setFilters((prev) => ({ ...prev, mine: e.target.checked }))}
            />
            Assigned to me
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setLayout("board")}
              className={cn(
                "rounded p-1.5",
                layout === "board" ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
              aria-label="Board view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={cn(
                "rounded p-1.5",
                layout === "list" ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          {canManage && (
            <Button size="sm" onClick={() => setModal({ open: true, task: null })}>
              <Plus className="h-4 w-4" /> Add task
            </Button>
          )}
        </div>
      </div>

      <ErrorBanner message={taskList.error?.message} className="mb-4" />

      {taskList.isLoading ? (
        <PageLoader />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No tasks"
          description="Create a task to start tracking work on this project."
        />
      ) : layout === "board" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUSES.map((status) => {
            const items = visible.filter((t) => (t.status || "TODO") === status)
            return (
              <div key={status} className="rounded-xl bg-muted/60 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={toneForStatus(status)}>{label(status)}</Badge>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <TaskCard
                      key={getId(t)}
                      task={t}
                      canManage={canManage}
                      onEdit={(task) => setModal({ open: true, task })}
                      onDelete={setToDelete}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((t) => (
            <TaskCard
              key={getId(t)}
              task={t}
              canManage={canManage}
              onEdit={(task) => setModal({ open: true, task })}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      <TaskFormModal
        open={modal.open}
        onClose={() => setModal({ open: false, task: null })}
        onSubmit={handleSubmit}
        initial={modal.task}
        members={members}
        mode={modal.task ? "edit" : "create"}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete task"
        message={`Delete "${toDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
