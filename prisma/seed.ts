import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // 1. Create Default Admin
  const hashedPassword = await bcrypt.hash('thestrongpassword', 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'mikrotikadmin' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'mikrotikadmin', // Usually an email, but requirements asked for username 'mikrotikadmin'
      password: hashedPassword,
    },
  })
  console.log(`✅ Admin user created/verified: ${admin.email}`)

  // 2. Create Default Event
  const startDate = new Date('2026-06-12T00:00:00.000Z')
  const endDate = new Date('2026-06-24T23:59:59.000Z')

  const event = await prisma.event.create({
    data: {
      title: 'Pelatihan & Sertifikasi MikroTik 2026',
      description: 'Pelatihan dan Sertifikasi MTCNA untuk Mahasiswa FTK Undiksha.',
      startDate,
      endDate,
      isActive: true,
      isDraft: false,
    },
  })
  console.log(`✅ Event created: ${event.title}`)

  // 3. Create Program Studi
  const prodis = [
    {
      name: 'S1 Sistem Informasi',
      degree: 'S1',
      requiredCourses: 'Jaringan Komputer + Jaringan Enterprise',
    },
    {
      name: 'S1 Pendidikan Teknik Informatika',
      degree: 'S1',
      requiredCourses: 'Jaringan Komputer + Jaringan Enterprise',
    },
    {
      name: 'S1 Ilmu Komputer',
      degree: 'S1',
      requiredCourses: 'Jaringan Komputer',
    },
    {
      name: 'D4 Teknik Rekayasa Sistem Elektronika',
      degree: 'D4',
      requiredCourses: 'Jaringan Komputer',
    },
  ]

  for (const prodi of prodis) {
    const createdProdi = await prisma.programStudi.upsert({
      where: { name: prodi.name },
      update: {},
      create: prodi,
    })
    console.log(`✅ Prodi created/verified: ${createdProdi.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
