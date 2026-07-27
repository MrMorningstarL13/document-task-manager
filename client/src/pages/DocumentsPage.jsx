import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import { useProjectStore } from "../store/projectStore"
import { PageHeader } from "../components/layout/PageHeader"
import { PageLoader, EmptyState } from "../components/ui/Misc"
import { ProjectPicker } from "../components/projects/ProjectPicker"
import { DocumentPanel } from "../components/documents/DocumentPanel"
import { getId } from "../lib/entities"

export default function DocumentsPage() {
  const { projects, loading, fetchMine } = useProjectStore()
  const [projectId, setProjectId] = useState("")

  useEffect(() => {
    fetchMine()
  }, [fetchMine])

  useEffect(() => {
    if (!projectId && projects.length) setProjectId(getId(projects[0]))
  }, [projects, projectId])

  return (
    <div>
      <PageHeader title="Documents" description="Upload and share files with your project teams.">
        {projects.length > 0 && (
          <ProjectPicker
            className="w-56"
            projects={projects}
            value={projectId}
            onChange={setProjectId}
          />
        )}
      </PageHeader>

      {loading && !projects.length ? (
        <PageLoader />
      ) : !projects.length ? (
        <EmptyState
          icon={FileText}
          title="No projects yet"
          description="Create a project first to upload documents."
        />
      ) : projectId ? (
        <DocumentPanel projectId={projectId} />
      ) : null}
    </div>
  )
}
