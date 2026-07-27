import { Select } from "../ui/Field"
import { getId } from "../../lib/entities"

export function ProjectPicker({ projects, value, onChange, className }) {
  return (
    <Select
      className={className}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        Select a project
      </option>
      {projects.map((p) => (
        <option key={getId(p)} value={getId(p)}>
          {p.name}
        </option>
      ))}
    </Select>
  )
}
