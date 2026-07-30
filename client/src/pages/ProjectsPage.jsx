import { useState } from "react"
import { Plus, FolderKanban, Search } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useProjectList, useCreateProject } from "../hooks/projectHooks"
import { PageHeader } from "../components/layout/PageHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Field"
import { PageLoader, EmptyState, ErrorBanner } from "../components/ui/Misc"
import { ProjectCard } from "../components/projects/ProjectCard"
import { ProjectFormModal } from "../components/projects/ProjectFormModal"
import { cn } from "../lib/utils"

export default function ProjectsPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin())
  const [view, setView] = useState("my")
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState("")

  const { data: projects = [], isLoading, error } = useProjectList(view)
  const createProject = useCreateProject()

  const create = async (payload) => createProject.mutateAsync(payload)

  const tabs = [
    { key: "my", label: "My Projects" },
    ...(isAdmin ? [{ key: "all", label: "All Projects" }] : []),
  ]

  const filtered = projects.filter((p) =>
    (p.name || "").toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Your team's workspaces, boards, and documents."
      >
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New project
        </Button>
      </PageHeader>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === t.key
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <ErrorBanner message={error} className="mb-4" />

      {isLoading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={query ? "No matching projects" : "No projects yet"}
          description={
            query
              ? "Try a different search term."
              : "Create your first project to start organizing work."
          }
          action={
            !query && (
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> New project
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id || p._id} project={p} />
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={create}
        mode="create"
      />
    </div>
  )
}
