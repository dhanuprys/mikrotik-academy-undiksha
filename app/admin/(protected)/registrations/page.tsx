import { getRegistrations, getEventsList, getProdiList } from '@/lib/cache'
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin-page-header'

export default async function RegistrationsPage({
 searchParams,
}: {
 searchParams: Promise<{ eventId?: string; status?: any; prodiId?: string; search?: string }>
}) {
 const params = await searchParams
 const filters = {
 eventId: params.eventId,
 status: params.status,
 programStudiId: params.prodiId,
 search: params.search,
 }

 const [registrations, events, prodis] = await Promise.all([
 getRegistrations(filters),
 getEventsList(),
 getProdiList(),
 ])

 return (
 <div className="space-y-6">
      <AdminPageHeader 
        title="Registrations"
        description="View and manage participant registrations"
        action={
          <Link 
            href={`/api/admin/registrations/export?eventId=${filters.eventId || ''}&status=${filters.status || ''}&prodiId=${filters.programStudiId || ''}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Export Excel
          </Link>
        }
      />

 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
 <form className="flex flex-wrap gap-4" method="GET">
 <div className="flex-1 min-w-[200px]">
 <input type="text" name="search" defaultValue={filters.search} placeholder="Search NIM or Name" className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm" />
 </div>
 <div className="w-48">
 <select name="eventId" defaultValue={filters.eventId || ''} className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm">
 <option value="">All Events</option>
 {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
 </select>
 </div>
 <div className="w-40">
 <select name="status" defaultValue={filters.status || ''} className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm">
 <option value="">All Status</option>
 <option value="PENDING">Pending</option>
 <option value="CONTACTED">Contacted</option>
 <option value="ACCEPTED">Accepted</option>
 <option value="REJECTED">Rejected</option>
 </select>
 </div>
 <div className="w-48">
 <select name="prodiId" defaultValue={filters.programStudiId || ''} className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm">
 <option value="">All Program Studi</option>
 {prodis.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
 </select>
 </div>
 <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Filter</button>
 </form>
 </div>

 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
 <table className="min-w-full divide-y divide-gray-200 ">
 <thead className="bg-gray-50 ">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM / Name</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200 ">
 {registrations.map(reg => (
 <tr key={reg.id}>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="text-sm font-medium text-gray-900 ">{reg.nim}</div>
 <div className="text-sm text-gray-500 ">{reg.name}</div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
 {reg.programStudi.name}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
 {reg.event.title}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
 ${reg.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
 ${reg.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
 ${reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
 ${reg.status === 'CONTACTED' ? 'bg-indigo-100 text-indigo-800' : ''}
 `}>
 {reg.status}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 <Link href={`/admin/registrations/${reg.id}`} className="text-blue-600 hover:text-blue-900 :text-blue-400">
 View
 </Link>
 </td>
 </tr>
 ))}
 {registrations.length === 0 && (
 <tr>
 <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No registrations found.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 )
}
