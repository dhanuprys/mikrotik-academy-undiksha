import { connection } from 'next/server'
import { NextResponse } from 'next/server'
import { getProdiList } from '@/lib/cache'

export async function GET() {
  await connection();
 const prodis = await getProdiList()
 return NextResponse.json(prodis)
}
