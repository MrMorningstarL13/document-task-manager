import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router"
import { useAuthStore } from "../store/authStore"
import { AuthLayout } from "../components/auth/AuthLayout"
import { Button } from "../components/ui/Button"
import { Field, Input } from "../components/ui/Field"
import { ErrorBanner } from "../components/ui/Misc"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ email: "", password: "" })
  const [touched, setTouched] = useState(false)

  const from = location.state?.from || "/app/projects"

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email"
    if (!form.password) errs.password = "Password is required"
    return errs
  }
  const errs = validate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errs).length) return
    const ok = await login(form)
    if (ok) navigate(from, { replace: true })
  }

  const update = (key) => (e) => {
    clearError()
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Hive workspace"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-foreground hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <ErrorBanner message={error} />
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={update("password")}
            error={touched && errs.password}
          />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
