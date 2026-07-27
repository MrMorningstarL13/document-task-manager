import { useEffect, useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Field, Input, Textarea, Select } from "../ui/Field"
import { ErrorBanner } from "../ui/Misc"
import { PROJECT_STATUSES, label } from "../../lib/entities"

const empty = { name: "", description: "", status: "ACTIVE" }

export function ProjectFormModal({ open, onClose, onSubmit, initial, mode = "create" }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name || "",
              description: initial.description || "",
              status: initial.status || "ACTIVE",
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
    if (!form.name.trim()) errs.name = "Project name is required"
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    setServerError("")
    try {
      await onSubmit(form)
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
      title={mode === "create" ? "New project" : "Edit project"}
      description={
        mode === "create"
          ? "Create a workspace for your team to collaborate."
          : "Update your project details."
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <ErrorBanner message={serverError} />
        <Field label="Name" htmlFor="p-name" error={errors.name}>
          <Input
            id="p-name"
            value={form.name}
            onChange={update("name")}
            placeholder="Marketing site redesign"
            error={errors.name}
          />
        </Field>
        <Field label="Description" htmlFor="p-desc">
          <Textarea
            id="p-desc"
            value={form.description}
            onChange={update("description")}
            placeholder="What is this project about?"
          />
        </Field>
        <Field label="Status" htmlFor="p-status">
          <Select id="p-status" value={form.status} onChange={update("status")}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {mode === "create" ? "Create project" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
