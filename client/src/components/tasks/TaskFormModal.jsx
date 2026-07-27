import { useEffect, useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Field, Input, Textarea, Select } from "../ui/Field"
import { ErrorBanner } from "../ui/Misc"
import { TASK_STATUSES, TASK_PRIORITIES, label, getId, displayName } from "../../lib/entities"

const empty = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  deadline: "",
  assigneeId: "",
}

export function TaskFormModal({ open, onClose, onSubmit, initial, members = [], mode = "create" }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title || "",
              description: initial.description || "",
              status: initial.status || "TODO",
              priority: initial.priority || "MEDIUM",
              deadline: initial.deadline ? initial.deadline.slice(0, 10) : "",
              assigneeId:
                initial.assigneeId || getId(initial.assignee) || "",
            }
          : empty,
      )
      setErrors({})
      setServerError("")
    }
  }, [open, initial])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = "Title is required"
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    setServerError("")
    try {
      const payload = { ...form }
      if (!payload.assigneeId) delete payload.assigneeId
      if (!payload.deadline) delete payload.deadline
      await onSubmit(payload)
      onClose()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New task" : "Edit task"}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <ErrorBanner message={serverError} />
        <Field label="Title" htmlFor="t-title" error={errors.title}>
          <Input
            id="t-title"
            value={form.title}
            onChange={update("title")}
            placeholder="Design the landing hero"
            error={errors.title}
          />
        </Field>
        <Field label="Description" htmlFor="t-desc">
          <Textarea id="t-desc" value={form.description} onChange={update("description")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status" htmlFor="t-status">
            <Select id="t-status" value={form.status} onChange={update("status")}>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priority" htmlFor="t-priority">
            <Select id="t-priority" value={form.priority} onChange={update("priority")}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {label(p)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Deadline" htmlFor="t-deadline">
            <Input id="t-deadline" type="date" value={form.deadline} onChange={update("deadline")} />
          </Field>
          <Field label="Assignee" htmlFor="t-assignee">
            <Select id="t-assignee" value={form.assigneeId} onChange={update("assigneeId")}>
              <option value="">Unassigned</option>
              {members.map((m) => {
                const u = m.user || m
                return (
                  <option key={getId(u)} value={getId(u)}>
                    {displayName(u)}
                  </option>
                )
              })}
            </Select>
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {mode === "create" ? "Create task" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
