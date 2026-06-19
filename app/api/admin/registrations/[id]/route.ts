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
    const { status, notes } = await request.json()

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    })

    revalidateTag(CACHE_TAGS.REGISTRATIONS, 'max')
    revalidateTag(CACHE_TAGS.DASHBOARD_STATS, 'max')

    return NextResponse.json(registration)
  } catch (error: any) {
    return NextResponse.json({ error: 'Error updating registration' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        event: true,
        programStudi: true,
      },
    })

    if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(registration)
  } catch (error: any) {
    return NextResponse.json({ error: 'Error fetching registration' }, { status: 500 })
  }
}
