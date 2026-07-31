import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useAuthStore } from "./store/authStore"
import { AppLayout } from "./components/layout/AppLayout"

import { ProtectedRoute, AdminRoute } from "./components/auth/Guards"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProjectsPage from "./pages/ProjectsPage"
import ProjectDetailPage from "./pages/ProjectDetailPage"
import TasksPage from "./pages/TasksPage"
import ProfilePage from "./pages/ProfilePage"
import UsersPage from "./pages/UsersPage"
import AuditLogsPage from "./pages/AuditLogsPage"

// Redirect to /login whenever the API reports an unauthorized session.
function UnauthorizedListener() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  useEffect(() => {
    const handler = () => {
      logout()
      navigate("/login", { replace: true })
    }
    window.addEventListener("hive:unauthorized", handler)
    return () => window.removeEventListener("hive:unauthorized", handler)
  }, [navigate, logout])
  return null
}

const queryClient = new QueryClient({
  staleTime: 5 * 60 * 1000
})

export default function App() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UnauthorizedListener />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/projects" replace />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="audit-logs"
              element={
                <AdminRoute>
                  <AuditLogsPage />
                </AdminRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/app/projects" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
