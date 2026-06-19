'use server'
import { CACHE_TAGS } from '@/lib/cache-tags'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getActiveEvent } from '@/lib/cache'
import { uploadFile } from '@/lib/upload'
import { updateTag } from 'next/cache'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

const schema = z.object({
  nim: z.string().min(5, 'NIM is too short'),
  name: z.string().min(3, 'Name is required'),
  phone: z.string().min(9, 'Phone number is invalid'),
  programStudiId: z.string().min(1, 'Program Studi is required'),
})

export async function registerAction(prevState: any, formData: FormData) {
  const activeEvent = await getActiveEvent()

  if (!activeEvent) {
    return { error: 'Registration is closed. No active event.' }
  }

  // Rate limiting (3 attempts per 5 minutes per IP)
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown-ip'
  if (!rateLimit(`register:${ip}`, 3, 5 * 60000)) {
    return { error: 'Too many registration attempts. Please try again later.' }
  }

  const now = new Date()
  if (now < activeEvent.startDate || now > activeEvent.endDate) {
    return { error: 'Registration is not currently open.' }
  }

  const data = {
    nim: formData.get('nim') as string,
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    programStudiId: formData.get('programStudiId') as string,
  }

  const result = schema.safeParse(data)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const paymentFile = formData.get('paymentFile') as File | null
  const ktmFile = formData.get('ktmFile') as File | null

  if (!paymentFile || paymentFile.size === 0) {
    return { error: 'Bukti Pembayaran is required' }
  }
  if (!ktmFile || ktmFile.size === 0) {
    return { error: 'KTM is required' }
  }

  try {
    const existing = await prisma.registration.findUnique({
      where: {
        nim_eventId: {
          nim: data.nim,
          eventId: activeEvent.id,
        },
      },
    })

    if (existing) {
      return { error: 'You have already registered for this event.' }
    }

    const paymentProofPath = await uploadFile(paymentFile, 'payment')
    const ktmPath = await uploadFile(ktmFile, 'ktm')

    await prisma.registration.create({
      data: {
        ...data,
        eventId: activeEvent.id,
        paymentProofPath,
        ktmPath,
      },
    })

    updateTag(CACHE_TAGS.REGISTRATIONS)
    updateTag(CACHE_TAGS.DASHBOARD_STATS)

    return { success: true }
  } catch (error: any) {
    console.error('Registration error:', error)
    return { error: 'An unexpected error occurred during registration. Please try again.' }
  }
}
