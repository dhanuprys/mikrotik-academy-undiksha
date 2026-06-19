import { connection } from 'next/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import * as xlsx from 'xlsx'

export async function GET(request: Request) {
  await connection();
 const session = await getSession()
 if (!session) return new NextResponse('Unauthorized', { status: 401 })

 const { searchParams } = new URL(request.url)
 const eventId = searchParams.get('eventId') || undefined
 const status = searchParams.get('status') || undefined
 const programStudiId = searchParams.get('prodiId') || undefined

 const where: any = {}
 if (eventId) where.eventId = eventId
 if (status) where.status = status
 if (programStudiId) where.programStudiId = programStudiId

 try {
 const registrations = await prisma.registration.findMany({
 where,
 include: {
 event: true,
 programStudi: true
 },
 orderBy: { createdAt: 'asc' }
 })

 const data = registrations.map(r => ({
 NIM: r.nim,
 Nama: r.name,
 'No HP / WA': r.phone,
 'Program Studi': r.programStudi.name,
 'Event': r.event.title,
 Status: r.status,
 'Catatan Admin': r.notes || '',
 'Tanggal Daftar': new Date(r.createdAt).toLocaleString()
 }))

 const ws = xlsx.utils.json_to_sheet(data)
 const wb = xlsx.utils.book_new()
 xlsx.utils.book_append_sheet(wb, ws, "Registrations")

 const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' })

 return new NextResponse(buf, {
 headers: {
 'Content-Disposition': 'attachment; filename="registrations.xlsx"',
 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
 }
 })
 } catch (error: any) {
 return new NextResponse('Error generating export', { status: 500 })
 }
}
