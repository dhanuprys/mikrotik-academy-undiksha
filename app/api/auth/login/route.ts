import { connection } from 'next/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  await connection();
 try {
 const body = await request.json()
 const { email, password } = body

 if (!email || !password) {
 return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 })
 }

 // Rate limiting (5 attempts per minute per IP)
 const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'
 if (!rateLimit(`login:${ip}`, 5, 60000)) {
 return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 })
 }

 const user = await prisma.adminUser.findUnique({
 where: { email },
 })

 if (!user) {
 return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
 }

 const passwordMatch = await bcrypt.compare(password, user.password)

 if (!passwordMatch) {
 return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
 }

 await createSession(user.id)

 return NextResponse.json({ success: true })
 } catch (error) {
 console.error('Login error:', error)
 return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
 }
}
