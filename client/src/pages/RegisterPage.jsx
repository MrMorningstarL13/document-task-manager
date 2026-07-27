import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "../store/authStore"
import { AuthLayout } from "../components/auth/AuthLayout"
import { Button } from "../components/ui/Button"
import { Field, Input } from "../components/ui/Field"
import { ErrorBanner } from "../components/ui/Misc"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [touched, setTouched] = useState(false)
  const [notice, setNotice] = useState("")

  const validate = () => {
    const errs = {}
    if (!form.name) errs.name = "Name is required"
    if (!form.email) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email"
    if (!form.password) errs.password = "Password is required"
    else if (form.password.length < 6) errs.password = "Use at least 6 characters"
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match"
    return errs
  }
  const errs = validate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errs).length) return
    const { name, email, password } = form
    const res = await register({ name, email, password })
    if (res.ok && res.autoLoggedIn) {
      navigate("/app/projects", { replace: true })
    } else if (res.ok) {
      setNotice("Account created. Please sign in.")
      setTimeout(() => navigate("/login"), 900)
    }
  }

  const update = (key) => (e) => {
    clearError()
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start collaborating with your team on Hive"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <ErrorBanner message={error} />
        {notice && (
          <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
            {notice}
          </div>
        )}
        <Field label="Full name" htmlFor="name" error={touched && errs.name}>
          <Input
            id="name"
            placeholder="Ada Lovelace"
            value={form.name}
            onChange={update("name")}
            error={touched && errs.name}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={touched && errs.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={update("email")}
            error={touched && errs.email}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={touched && errs.password}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={update("password")}
            error={touched && errs.password}
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirm" error={touched && errs.confirm}>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={update("confirm")}
            error={touched && errs.confirm}
          />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
