import { connection } from 'next/server'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

export async function GET() {
  await connection();
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const prodis = await prisma.programStudi.findMany({ orderBy: { name: 'asc' } })
 return NextResponse.json(prodis)
}

export async function POST(request: Request) {
  await connection();
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 try {
 const { name, requiredCourses, degree } = await request.json()
 
 if (!name || !requiredCourses || !degree) {
 return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
 }

 const prodi = await prisma.programStudi.create({ 
 data: { name, requiredCourses, degree } 
 })
 revalidateTag(CACHE_TAGS.PRODI, 'max')
 return NextResponse.json(prodi)
 } catch (error: any) {
 return NextResponse.json({ error: 'Error creating program studi' }, { status: 500 })
 }
}
