import { connection } from 'next/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

const UPLOADS_DIR = path.join(process.cwd(), 'storage/uploads')

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection()
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'payment' or 'ktm'

  if (type !== 'payment' && type !== 'ktm') {
    return new NextResponse('Invalid file type requested', { status: 400 })
  }

  try {
    const registration = await prisma.registration.findUnique({ where: { id } })
    if (!registration) {
      return new NextResponse('Registration not found', { status: 404 })
    }

    const filePathRel = type === 'payment' ? registration.paymentProofPath : registration.ktmPath
    const filePath = path.resolve(UPLOADS_DIR, filePathRel)

    if (!filePath.startsWith(path.resolve(UPLOADS_DIR))) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    // Determine content type (naive)
    const ext = path.extname(filePath).toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    if (ext === '.png') contentType = 'image/png'
    if (ext === '.pdf') contentType = 'application/pdf'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
      },
    })
  } catch (error: any) {
    return new NextResponse('Error serving file', { status: 500 })
  }
}
