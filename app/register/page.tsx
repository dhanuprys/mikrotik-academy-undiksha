import { getActiveEvent, getProdiList } from '@/lib/cache'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import RegisterForm from './form'

import { Suspense } from 'react'

async function RegisterContent() {
 const [activeEvent, prodis] = await Promise.all([
 getActiveEvent(),
 getProdiList()
 ])

 if (!activeEvent) {
 redirect('/')
 }

 await connection()
 const now = new Date()
 if (now < activeEvent.startDate || now > activeEvent.endDate) {
 redirect('/')
 }

 return <RegisterForm prodis={prodis} />
}

export default function RegisterPageWrapper() {
 return (
 <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
 <RegisterContent />
 </Suspense>
 )
}
