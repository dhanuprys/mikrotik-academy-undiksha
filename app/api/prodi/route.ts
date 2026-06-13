import { NextResponse } from 'next/server'
import { getProdiList } from '@/lib/cache'

export async function GET() {
 const prodis = await getProdiList()
 return NextResponse.json(prodis)
}
