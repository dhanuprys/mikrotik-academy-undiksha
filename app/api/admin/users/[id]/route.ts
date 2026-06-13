import { CACHE_TAGS } from '@/lib/cache-tags'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const { id } = await params
 try {
 const { name, email, password } = await request.json()
 const data: any = { name, email }
 
 if (password) {
 data.password = await bcrypt.hash(password, 10)
 }

 const user = await prisma.adminUser.update({ 
 where: { id }, 
 data,
 select: { id: true, name: true, email: true }
 })
 revalidateTag(CACHE_TAGS.ADMIN_USERS, 'max')
 return NextResponse.json(user)
 } catch (error: any) {
 if (error.code === 'P2002') return NextResponse.json({ error: 'Email/Username already exists' }, { status: 400 })
 return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
 }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
 const session = await getSession()
 if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const { id } = await params
 
 // Prevent deleting oneself
 if (session.userId === id) {
 return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
 }

 try {
 await prisma.adminUser.delete({ where: { id } })
 revalidateTag(CACHE_TAGS.ADMIN_USERS, 'max')
 return NextResponse.json({ success: true })
 } catch (error: any) {
 return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
 }
}
