import { useEffect, useRef, useState } from "react"
import { Upload, FileText, Download, Trash2, File } from "lucide-react"
import { useDocumentStore } from "../../store/documentStore"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { PageLoader, EmptyState, ErrorBanner } from "../ui/Misc"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { getId, label } from "../../lib/entities"
import { formatDate, formatBytes } from "../../lib/utils"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
]

export function DocumentPanel({ projectId }) {
  const { documents, loading, error, fetch, upload, remove, download } = useDocumentStore()
  const inputRef = useRef(null)
  const [uploadError, setUploadError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (projectId) fetch(projectId)
  }, [projectId, fetch])

  const validate = (file) => {
    if (file.size > MAX_BYTES) return `"${file.name}" is larger than 10 MB.`
    if (ALLOWED.length && file.type && !ALLOWED.includes(file.type))
      return `"${file.type}" files are not allowed.`
    return null
  }

  const handleFiles = async (fileList) => {
    const file = fileList?.[0]
    if (!file) return
    const err = validate(file)
    if (err) {
      setUploadError(err)
      return
    }
    setUploadError("")
    setUploading(true)
    try {
      await upload(projectId, file)
    } catch (e) {
      setUploadError(e.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await remove(projectId, getId(toDelete))
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={
          "mb-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors " +
          (dragActive ? "border-accent bg-accent/5" : "border-border bg-card")
        }
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Drag &amp; drop a file, or{" "}
          <button
            type="button"
            className="text-accent underline-offset-2 hover:underline"
            onClick={() => inputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Up to 10 MB. PDF, images, docs, sheets.</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading && (
          <div className="mt-3">
            <Button size="sm" loading disabled>
              Uploading...
            </Button>
          </div>
        )}
      </div>

      <ErrorBanner message={uploadError || error} className="mb-4" />

      {loading ? (
        <PageLoader />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents"
          description="Upload files to share them with project members."
        />
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={getId(doc)} className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <File className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-foreground">
                  {doc.name || doc.filename || doc.originalName || "Untitled"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(doc.size)}
                  {doc.createdAt ? ` \u00b7 ${formatDate(doc.createdAt)}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => download(projectId, doc)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Download document"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setToDelete(doc)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                  aria-label="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete document"
        message={`Delete "${toDelete?.name || toDelete?.filename || "this file"}"?`}
        confirmLabel="Delete"
      />
    </div>
  )
}
