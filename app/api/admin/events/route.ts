import { CACHE_TAGS } from '@/lib/cache-tags'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

export async function GET() {
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const events = await prisma.event.findMany({
 orderBy: { createdAt: 'desc' }
 })
 
 return NextResponse.json(events)
}

export async function POST(request: Request) {
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 try {
 const formData = await request.formData()
 const title = formData.get('title') as string
 const description = formData.get('description') as string | null
 const startDate = new Date(formData.get('startDate') as string)
 const endDate = new Date(formData.get('endDate') as string)
 const isDraft = formData.get('isDraft') === 'true'

 // Not handling poster upload in this MVP example for POST, let's keep it simple or implement it.
 // Let's implement poster upload
 const posterFile = formData.get('poster') as File | null
 let posterPath = null

 if (posterFile && posterFile.size > 0) {
 const { uploadFile } = await import('@/lib/upload')
 posterPath = await uploadFile(posterFile, 'posters')
 }

 const event = await prisma.event.create({
 data: {
 title,
 description,
 startDate,
 endDate,
 isDraft,
 posterPath,
 }
 })

 revalidateTag(CACHE_TAGS.EVENTS, 'max')

 return NextResponse.json(event)
 } catch (error: any) {
 console.error(error)
 return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
 }
}
