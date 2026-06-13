import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const UPLOADS_DIR = path.join(process.cwd(), 'storage/uploads')

export async function uploadFile(file: File, folder: 'posters' | 'payment' | 'ktm'): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit.')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Validate type (MIME)
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.')
  }

  // Validate actual file extension to prevent spoofing
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
  const ext = path.extname(file.name).toLowerCase()
  if (!allowedExtensions.includes(ext)) {
    throw new Error('Invalid file extension.')
  }

  const dir = path.join(UPLOADS_DIR, folder)
  
  if (!fs.existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }

  const uniqueName = `${uuidv4()}${ext}`
  const filePath = path.join(dir, uniqueName)

  await writeFile(filePath, buffer)

  return `${folder}/${uniqueName}`
}
