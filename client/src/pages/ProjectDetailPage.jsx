import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  UserPlus,
  Users,
  ListTodo,
  FileText,
} from "lucide-react"
import { useProjectStore } from "../store/projectStore"
import { useDocumentStore } from "../store/documentStore"
import { PageLoader, EmptyState, ErrorBanner, Avatar } from "../components/ui/Misc"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Badge, toneForStatus } from "../components/ui/Badge"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { ProjectFormModal } from "../components/projects/ProjectFormModal"
import { AddMemberModal } from "../components/projects/AddMemberModal"
import { TaskBoard } from "../components/tasks/TaskBoard"
import { DocumentPanel } from "../components/documents/DocumentPanel"
import {
  getId,
  ownerName,
  memberList,
  displayName,
  label,
  isActiveUser,
} from "../lib/entities"
import { cn } from "../lib/utils"

const TABS = [
  { key: "tasks", label: "Tasks", icon: ListTodo },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "members", label: "Members", icon: Users },
]

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, fetchMine, update, remove, addMember } = useProjectStore()
  const [tab, setTab] = useState("tasks")
  const [editOpen, setEditOpen] = useState(false)
  const [memberOpen, setMemberOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(false)

  const project = useMemo(
    () => projects.find((p) => String(getId(p)) === projectId),
    [projects, projectId],
  )

  useEffect(() => {
    if (!project) {
      setLoading(true)
      fetchMine().finally(() => setLoading(false))
    }
  }, [project, fetchMine])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await remove(projectId)
      navigate("/app/projects", { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  if (loading && !project) return <PageLoader />

  if (!project) {
    return (
      <EmptyState
        icon={ListTodo}
        title="Project not found"
        description="This project may have been deleted or you don't have access."
        action={
          <Button as={Link} to="/app/projects" variant="secondary">
            Back to projects
          </Button>
        }
      />
    )
  }

  const members = memberList(project)

  return (
    <div>
      <Link
        to="/app/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              {project.name}
            </h1>
            <Badge tone={toneForStatus(project.status)}>{label(project.status)}</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {project.description || "No description provided."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              Owner: <span className="font-medium text-foreground">{ownerName(project)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {members.length} members
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setMemberOpen(true)}>
            <UserPlus className="h-4 w-4" /> Add member
          </Button>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-1 border-b border-border">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.key
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === "tasks" && <TaskBoard projectId={projectId} members={members} />}
      {tab === "documents" && <DocumentPanel projectId={projectId} />}
      {tab === "members" && <MembersList members={members} />}

      <ProjectFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={(payload) => update(projectId, payload)}
        initial={project}
        mode="edit"
      />

      <AddMemberModal
        open={memberOpen}
        onClose={() => setMemberOpen(false)}
        onSubmit={(payload) => addMember(projectId, payload)}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete project"
        message={`Delete "${project.name}"? This will archive the project and its tasks.`}
        confirmLabel="Delete project"
      />
    </div>
  )
}

function MembersList({ members }) {
  if (!members.length) {
    return (
      <EmptyState
        icon={Users}
        title="No members yet"
        description="Add teammates to collaborate on this project."
      />
    )
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => {
        const user = m.user || m
        const role = m.role || user.role
        return (
          <Card key={getId(user) || getId(m)} className="flex items-center gap-3 p-4">
            <Avatar name={displayName(user)} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium text-foreground">
                {displayName(user)}
              </p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {role && <Badge tone="info">{label(role)}</Badge>}
              {!isActiveUser(user) && <Badge tone="danger">Inactive</Badge>}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
