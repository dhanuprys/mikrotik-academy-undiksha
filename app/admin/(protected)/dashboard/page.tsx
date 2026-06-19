import { getActiveEvent, getDashboardStats } from '@/lib/cache'
import { Suspense } from 'react'
import { AdminPageHeader } from '@/components/admin-page-header'
import Link from 'next/link'

import { connection } from 'next/server'

export default async function DashboardPage() {
  if (process.env.CI) {
    await connection()
  }
 const activeEvent = await getActiveEvent()

 if (!activeEvent) {
 return (
 <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 ">
 <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
 <p className="text-gray-600 mb-4">No active event found.</p>
 <Link href="/admin/events" className="text-blue-600 hover:underline">
 Go to Events to activate one.
 </Link>
 </div>
 )
 }

 const stats = await getDashboardStats(activeEvent.id)

 return (
 <div className="space-y-6">
 <AdminPageHeader 
   title="Dashboard" 
   description="Overview of Mikrotik Academy Registrations"
   action={
     <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
       Active: {activeEvent.title}
     </span>
   }
 />

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatCard title="Total Registrations" value={stats.totalRegistrations} color="bg-blue-500" />
 <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
 <StatCard title="Contacted" value={stats.contacted} color="bg-indigo-500" />
 <StatCard title="Accepted" value={stats.accepted} color="bg-green-500" />
 <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" />
 </div>

 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrations by Program Studi</h3>
 {stats.registrationsByProdi.length === 0 ? (
 <p className="text-gray-500">No registrations yet.</p>
 ) : (
 <div className="space-y-4">
 {stats.registrationsByProdi.map((p, i) => (
 <div key={i} className="flex justify-between items-center">
 <span className="text-gray-600 ">{p.prodiName}</span>
 <span className="font-semibold text-gray-800 ">{p.count}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
 <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl mr-4`}>
 {value}
 </div>
 <div>
 <p className="text-sm text-gray-500 font-medium">{title}</p>
 <p className="text-2xl font-bold text-gray-800 ">{value}</p>
 </div>
 </div>
 )
}
