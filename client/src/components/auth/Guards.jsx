import { Navigate, useLocation } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { PageLoader, EmptyState } from "../ui/Misc"
import { ShieldAlert } from "lucide-react"

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const { token, user, initializing } = useAuthStore()

  if (initializing) return <PageLoader />
  if (!token && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

export function AdminRoute({ children }) {
  const { isAdmin, initializing } = useAuthStore()
  if (initializing) return <PageLoader />
  if (!isAdmin()) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admins only"
        description="You don't have permission to view this page."
      />
    )
  }
  return children
}
