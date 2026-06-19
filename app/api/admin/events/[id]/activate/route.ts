import { connection } from 'next/server'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection();
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const { id } = await params
 
 try {
 // Transaction: Set all to inactive, then set the target to active
 await prisma.$transaction([
 prisma.event.updateMany({
 where: { isActive: true },
 data: { isActive: false }
 }),
 prisma.event.update({
 where: { id },
 data: { isActive: true, isDraft: false } // activating also un-drafts it automatically
 })
 ])

 revalidateTag(CACHE_TAGS.EVENTS, 'max')
 revalidateTag(CACHE_TAGS.ACTIVE_EVENT, 'max')

 return NextResponse.json({ success: true })
 } catch (error: any) {
 return NextResponse.json({ error: 'Error activating event' }, { status: 500 })
 }
}
