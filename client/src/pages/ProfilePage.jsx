import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { PageHeader } from "../components/layout/PageHeader"
import { Card, CardHeader, CardTitle, CardBody } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Field, Input } from "../components/ui/Field"
import { Avatar, ErrorBanner } from "../components/ui/Misc"
import { Badge } from "../components/ui/Badge"
import { displayName, label } from "../lib/entities"

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  const [form, setForm] = useState({
    name: user?.name || user?.fullName || "",
    email: user?.email || "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setSuccess(false)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)
    try {
      await updateProfile({ name: form.name, email: form.email })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" description="Manage your account details." />

      <Card className="mb-6">
        <CardBody className="flex items-center gap-4">
          <Avatar name={displayName(user)} size="lg" />
          <div>
            <p className="text-lg font-semibold text-foreground">{displayName(user)}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.role && (
              <div className="mt-1">
                <Badge tone="info">{label(user.role)}</Badge>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account settings</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <ErrorBanner message={error} />
            {success && (
              <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
                Profile updated successfully.
              </div>
            )}
            <Field label="Full name" htmlFor="name">
              <Input id="name" value={form.name} onChange={update("name")} />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" type="email" value={form.email} onChange={update("email")} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                Save changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
