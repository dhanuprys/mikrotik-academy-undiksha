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
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Export Excel
          </Link>
        }
      />

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <form className="flex flex-wrap gap-4" method="GET">
          <div className="min-w-[200px] flex-1">
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Search NIM or Name"
              className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="w-48">
            <select
              name="eventId"
              defaultValue={filters.eventId || ''}
              className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            >
              <option value="">All Events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <select
              name="status"
              defaultValue={filters.status || ''}
              className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONTACTED">Contacted</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="w-48">
            <select
              name="prodiId"
              defaultValue={filters.programStudiId || ''}
              className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            >
              <option value="">All Program Studi</option>
              {prodis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
            Filter
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                NIM / Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Program Studi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {registrations.map((reg) => (
              <tr key={reg.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{reg.nim}</div>
                  <div className="text-sm text-gray-500">{reg.name}</div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {reg.programStudi.name}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {reg.event.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${reg.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''} ${reg.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''} ${reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''} ${reg.status === 'CONTACTED' ? 'bg-indigo-100 text-indigo-800' : ''} `}
                  >
                    {reg.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <Link
                    href={`/admin/registrations/${reg.id}`}
                    className=":text-blue-400 text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
