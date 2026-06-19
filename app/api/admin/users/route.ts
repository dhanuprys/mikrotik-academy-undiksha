import { connection } from 'next/server'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function GET() {
  await connection();
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const users = await prisma.adminUser.findMany({ 
 select: { id: true, name: true, email: true, createdAt: true },
 orderBy: { createdAt: 'desc' } 
 })
 return NextResponse.json(users)
}

export async function POST(request: Request) {
  await connection();
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 try {
 const { name, email, password } = await request.json()
 const hashedPassword = await bcrypt.hash(password, 10)

 const user = await prisma.adminUser.create({
 data: { name, email, password: hashedPassword },
 select: { id: true, name: true, email: true }
 })
 revalidateTag(CACHE_TAGS.ADMIN_USERS, 'max')
 return NextResponse.json(user)
 } catch (error: any) {
 if (error.code === 'P2002') return NextResponse.json({ error: 'Email/Username already exists' }, { status: 400 })
 return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
 }
}
