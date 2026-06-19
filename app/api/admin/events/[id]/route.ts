import { connection } from 'next/server'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const formData = await request.formData()
    const data: any = {}

    if (formData.has('title')) data.title = formData.get('title') as string
    if (formData.has('description')) data.description = formData.get('description') as string
    if (formData.has('startDate')) data.startDate = new Date(formData.get('startDate') as string)
    if (formData.has('endDate')) data.endDate = new Date(formData.get('endDate') as string)
    if (formData.has('isDraft')) data.isDraft = formData.get('isDraft') === 'true'

    const posterFile = formData.get('poster') as File | null
    if (posterFile && posterFile.size > 0) {
      const { uploadFile } = await import('@/lib/upload')
      data.posterPath = await uploadFile(posterFile, 'posters')
    }

    const event = await prisma.event.update({
      where: { id },
      data,
    })

    revalidateTag(CACHE_TAGS.EVENTS, 'max')
    revalidateTag(CACHE_TAGS.ACTIVE_EVENT, 'max')

    return NextResponse.json(event)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating event' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.event.delete({ where: { id } })
    revalidateTag(CACHE_TAGS.EVENTS, 'max')
    revalidateTag(CACHE_TAGS.ACTIVE_EVENT, 'max')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 })
  }
}
