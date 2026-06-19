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
    const data = await request.json()
    const prodi = await prisma.programStudi.update({ where: { id }, data })
    revalidateTag(CACHE_TAGS.PRODI, 'max')
    return NextResponse.json(prodi)
  } catch (error: any) {
    return NextResponse.json({ error: 'Error updating program studi' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.programStudi.delete({ where: { id } })
    revalidateTag(CACHE_TAGS.PRODI, 'max')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Error deleting program studi' }, { status: 500 })
  }
}
