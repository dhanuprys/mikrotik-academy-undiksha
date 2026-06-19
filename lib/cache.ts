import { CACHE_TAGS } from './cache-tags'
import { cacheLife, cacheTag } from 'next/cache'
import prisma from './prisma'

export async function getActiveEvent() {
  'use cache'
  cacheLife('hours')
  cacheTag(CACHE_TAGS.ACTIVE_EVENT)
  return prisma.event.findFirst({
    where: { isActive: true, isDraft: false },
  })
}

export async function getProdiList() {
  'use cache'
  cacheLife('days')
  cacheTag(CACHE_TAGS.PRODI)
  return prisma.programStudi.findMany({ orderBy: { name: 'asc' } })
}

export async function getDashboardStats(eventId: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag(CACHE_TAGS.DASHBOARD_STATS)

  const [totalRegistrations, pending, contacted, accepted, rejected, byProdi] = await Promise.all([
    prisma.registration.count({ where: { eventId } }),
    prisma.registration.count({ where: { eventId, status: 'PENDING' } }),
    prisma.registration.count({ where: { eventId, status: 'CONTACTED' } }),
    prisma.registration.count({ where: { eventId, status: 'ACCEPTED' } }),
    prisma.registration.count({ where: { eventId, status: 'REJECTED' } }),
    prisma.registration.groupBy({
      by: ['programStudiId'],
      where: { eventId },
      _count: { id: true },
    }),
  ])

  // Get prodi names for the grouping
  const prodiIds = byProdi.map((p) => p.programStudiId)
  const prodis = await prisma.programStudi.findMany({
    where: { id: { in: prodiIds } },
  })

  const registrationsByProdi = byProdi.map((p) => ({
    prodiName: prodis.find((pr) => pr.id === p.programStudiId)?.name || 'Unknown',
    count: p._count.id,
  }))

  return {
    totalRegistrations,
    pending,
    contacted,
    accepted,
    rejected,
    registrationsByProdi,
  }
}

// Simple filter interface
export interface RegistrationFilters {
  eventId?: string
  status?: 'PENDING' | 'CONTACTED' | 'ACCEPTED' | 'REJECTED'
  programStudiId?: string
  search?: string
}

export async function getRegistrations(filters: RegistrationFilters) {
  'use cache'
  cacheLife('minutes')
  cacheTag(CACHE_TAGS.REGISTRATIONS)

  const where: Record<string, unknown> = {}
  if (filters.eventId) where.eventId = filters.eventId
  if (filters.status) where.status = filters.status
  if (filters.programStudiId) where.programStudiId = filters.programStudiId
  if (filters.search) {
    where.OR = [
      { nim: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return prisma.registration.findMany({
    where,
    include: {
      programStudi: true,
      event: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getEventsList() {
  'use cache'
  cacheLife('hours')
  cacheTag(CACHE_TAGS.EVENTS)
  return prisma.event.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getAdminUsers() {
  'use cache'
  cacheLife('hours')
  cacheTag(CACHE_TAGS.ADMIN_USERS)
  return prisma.adminUser.findMany()
}
