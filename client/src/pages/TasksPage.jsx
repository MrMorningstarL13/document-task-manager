import { useEffect, useState } from "react"
import { ListTodo } from "lucide-react"
import { useProjectStore } from "../store/projectStore"
import { PageHeader } from "../components/layout/PageHeader"
import { PageLoader, EmptyState } from "../components/ui/Misc"
import { ProjectPicker } from "../components/projects/ProjectPicker"
import { TaskBoard } from "../components/tasks/TaskBoard"
import { getId, memberList } from "../lib/entities"

export default function TasksPage() {
  const { projects, loading, fetchMine } = useProjectStore()
  const [projectId, setProjectId] = useState("")

  useEffect(() => {
    fetchMine()
  }, [fetchMine])

  useEffect(() => {
    if (!projectId && projects.length) setProjectId(String(getId(projects[0])))
  }, [projects, projectId])

  const active = projects.find((p) => String(getId(p)) === projectId)

  return (
    <div>
      <PageHeader title="Tasks" description="Track work across your projects on a Hive-style board.">
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
          icon={ListTodo}
          title="No projects yet"
          description="Create a project first to start adding tasks."
        />
      ) : active ? (
        <TaskBoard projectId={projectId} members={memberList(active)} initialMine={true} />
      ) : null}
    </div>
  )
}
