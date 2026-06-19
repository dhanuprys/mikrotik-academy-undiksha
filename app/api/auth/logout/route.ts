import { connection } from 'next/server'
import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST() {
  await connection()
  await deleteSession()
  return NextResponse.json({ success: true })
}
