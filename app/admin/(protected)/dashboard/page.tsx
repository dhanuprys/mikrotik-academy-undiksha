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
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="mb-4 text-gray-600">No active event found.</p>
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
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Active: {activeEvent.title}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          color="bg-blue-500"
        />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
        <StatCard title="Contacted" value={stats.contacted} color="bg-indigo-500" />
        <StatCard title="Accepted" value={stats.accepted} color="bg-green-500" />
        <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Registrations by Program Studi</h3>
        {stats.registrationsByProdi.length === 0 ? (
          <p className="text-gray-500">No registrations yet.</p>
        ) : (
          <div className="space-y-4">
            {stats.registrationsByProdi.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-600">{p.prodiName}</span>
                <span className="font-semibold text-gray-800">{p.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="flex items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div
        className={`h-12 w-12 rounded-full ${color} mr-4 flex items-center justify-center text-xl font-bold text-white`}
      >
        {value}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
