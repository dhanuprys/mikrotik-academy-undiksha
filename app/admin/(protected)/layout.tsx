import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'
import { Suspense } from 'react'

async function AdminContent({ children }: { children: React.ReactNode }) {
 const session = await getSession()
 
 if (!session) {
 redirect('/admin/login')
 }

 return (
 <div className="flex h-screen bg-gray-100 ">
 {/* Sidebar */}
 <aside className="w-64 bg-white shadow-md">
 <div className="p-6">
 <h2 className="text-xl font-bold text-gray-800 ">Admin Panel</h2>
 </div>
 <nav className="mt-6">
 <Link href="/admin/dashboard" className="block px-6 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 hover:text-blue-600 :text-blue-400">
 Dashboard
 </Link>
 <Link href="/admin/events" className="block px-6 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 hover:text-blue-600 :text-blue-400">
 Events
 </Link>
 <Link href="/admin/registrations" className="block px-6 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 hover:text-blue-600 :text-blue-400">
 Registrations
 </Link>
 <Link href="/admin/prodi" className="block px-6 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 hover:text-blue-600 :text-blue-400">
 Program Studi
 </Link>
 <Link href="/admin/users" className="block px-6 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 hover:text-blue-600 :text-blue-400">
 Users
 </Link>
 </nav>
 </aside>

 {/* Main Content */}
 <div className="flex-1 flex flex-col overflow-hidden">
 <header className="flex justify-between items-center p-4 bg-white shadow-sm">
 <h1 className="text-xl font-semibold text-gray-800 ">Mikrotik Academy</h1>
 <LogoutButton />
 </header>
 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
 {children}
 </main>
 </div>
 </div>
 )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 return (
 <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Admin...</div>}>
 <AdminContent>{children}</AdminContent>
 </Suspense>
 )
}
