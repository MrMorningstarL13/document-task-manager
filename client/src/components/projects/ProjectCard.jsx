import { Link } from "react-router"
import { Users, User } from "lucide-react"
import { Card } from "../ui/Card"
import { Badge, toneForStatus } from "../ui/Badge"
import { getId, ownerName, memberCount, label } from "../../lib/entities"

export function ProjectCard({ project }) {
  const id = getId(project)
  return (
    <Link to={`/app/projects/${id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="flex h-full flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-semibold text-foreground group-hover:text-accent">
              {project.name}
            </h3>
            <Badge tone={toneForStatus(project.status)}>{label(project.status)}</Badge>
          </div>
          <p className="mb-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {project.description || "No description provided."}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="line-clamp-1">{ownerName(project)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {memberCount(project)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
