import { useEffect, useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Field, Input, Select } from "../ui/Field"
import { ErrorBanner } from "../ui/Misc"

const empty = { email: "", role: "MEMBER" }

export function AddMemberModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(empty)
      setErrors({})
      setServerError("")
    }
  }, [open])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email"
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    setServerError("")
    try {
      await onSubmit({ email: form.email.trim(), role: form.role })
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
      title="Add member"
      description="Invite a teammate to collaborate on this project."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <ErrorBanner message={serverError} />
        <Field label="Email" htmlFor="m-email" error={errors.email}>
          <Input
            id="m-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="teammate@company.com"
            error={errors.email}
          />
        </Field>
        <Field label="Role" htmlFor="m-role">
          <Select id="m-role" value={form.role} onChange={update("role")}>
            <option value="MEMBER">Member</option>
            <option value="MANAGER">Manager</option>
            <option value="VIEWER">Viewer</option>
          </Select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Add member
          </Button>
        </div>
      </form>
    </Modal>
  )
}
