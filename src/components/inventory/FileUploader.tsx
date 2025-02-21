import type React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface FileUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
  uploading: boolean
  file: File | null
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange, onUpload, uploading, file }) => {
  return (
    <div className="flex items-center space-x-4">
      <Input type="file" onChange={onFileChange} className="flex-grow" />
      <Button onClick={onUpload} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}

export default FileUploader

