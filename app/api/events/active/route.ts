import { connection } from 'next/server'
import { NextResponse } from 'next/server'
import { getActiveEvent } from '@/lib/cache'
import path from 'path'
import fs from 'fs'

const UPLOADS_DIR = path.join(process.cwd(), 'storage/uploads')

export async function GET(request: Request) {
  await connection();
 const { searchParams } = new URL(request.url)
 const poster = searchParams.get('poster')
 const activeEvent = await getActiveEvent()

 if (!activeEvent) {
 return NextResponse.json({ error: 'No active event found' }, { status: 404 })
 }

 // If asking for poster image specifically
 if (poster === 'true' && activeEvent.posterPath) {
 const filePath = path.resolve(UPLOADS_DIR, activeEvent.posterPath)
 
 if (!filePath.startsWith(path.resolve(UPLOADS_DIR))) {
 return new NextResponse('Forbidden', { status: 403 })
 }

 if (fs.existsSync(filePath)) {
 const fileBuffer = fs.readFileSync(filePath)
 const ext = path.extname(filePath).toLowerCase()
 let contentType = 'application/octet-stream'
 if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
 if (ext === '.png') contentType = 'image/png'

 return new NextResponse(fileBuffer, {
 headers: { 
 'Content-Type': contentType,
 'X-Content-Type-Options': 'nosniff',
 'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
 }
 })
 }
 }

 return NextResponse.json(activeEvent)
}
