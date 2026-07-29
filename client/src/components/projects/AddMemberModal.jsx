import { useEffect, useMemo, useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Field, Input, Select } from "../ui/Field"
import { ErrorBanner } from "../ui/Misc"
import { useUserStore } from "../../store/userStore"
import { displayName, getId } from "../../lib/entities"

const empty = { userId: "", search: "" }

export function AddMemberModal({ open, onClose, onSubmit }) {
  const { users, loading: loadingUsers, error: userError, fetchAll } = useUserStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(empty)
      setErrors({})
      setServerError("")
      fetchAll()
    }
  }, [open, fetchAll])

  const filteredUsers = useMemo(() => {
    const query = form.search.trim().toLowerCase()
    if (!query) return users
    return users.filter((u) => {
      return (
        displayName(u).toLowerCase().includes(query) ||
        (u.email || "").toLowerCase().includes(query)
      )
    })
  }, [form.search, users])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.userId) errs.userId = "Select a user"
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    setServerError("")
    try {
      await onSubmit({ userId: Number(form.userId) })
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
      description="Select a user to add to this project."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <ErrorBanner message={serverError || userError} />
        <Field label="Search users" htmlFor="m-search">
          <Input
            id="m-search"
            value={form.search}
            onChange={update("search")}
            placeholder="Search by name or email"
          />
        </Field>
        <Field label="Select user" htmlFor="m-user" error={errors.userId}>
          <Select
            id="m-user"
            value={form.userId}
            onChange={update("userId")}
            disabled={loadingUsers}
          >
            <option value="">Choose a user</option>
            {filteredUsers.map((user) => (
              <option key={getId(user)} value={getId(user)}>
                {displayName(user)}{user.email ? ` (${user.email})` : ""}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving || loadingUsers}>
            Add member
          </Button>
        </div>
      </form>
    </Modal>
  )
}
