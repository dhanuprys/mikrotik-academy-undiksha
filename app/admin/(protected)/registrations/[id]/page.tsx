import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import StatusUpdater from './status-updater'

export default async function RegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params
 
 const registration = await prisma.registration.findUnique({
 where: { id },
 include: {
 programStudi: true,
 event: true
 }
 })

 if (!registration) {
 notFound()
 }

 return (
 <div className="space-y-6 max-w-4xl mx-auto">
 <div className="flex items-center space-x-4">
 <Link href="/admin/registrations" className="text-gray-500 hover:text-gray-700">
 &larr; Back
 </Link>
 <h2 className="text-2xl font-bold text-gray-800 ">Registration Details</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Student Info */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
 <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Student Information</h3>
 
 <div>
 <p className="text-sm text-gray-500 ">Name</p>
 <p className="font-medium text-gray-900 ">{registration.name}</p>
 </div>
 <div>
 <p className="text-sm text-gray-500 ">NIM</p>
 <p className="font-medium text-gray-900 ">{registration.nim}</p>
 </div>
 <div>
 <p className="text-sm text-gray-500 ">WhatsApp / Phone</p>
 <p className="font-medium text-gray-900 ">
 <a href={`https://wa.me/${registration.phone}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
 {registration.phone}
 </a>
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500 ">Program Studi</p>
 <p className="font-medium text-gray-900 ">{registration.programStudi.name}</p>
 </div>
 <div>
 <p className="text-sm text-gray-500 ">Event</p>
 <p className="font-medium text-gray-900 ">{registration.event.title}</p>
 </div>
 <div>
 <p className="text-sm text-gray-500 ">Registration Date</p>
 <p className="font-medium text-gray-900 ">{new Date(registration.createdAt).toLocaleString()}</p>
 </div>
 </div>

 {/* Status Updater */}
 <StatusUpdater id={registration.id} currentStatus={registration.status} currentNotes={registration.notes} />
 </div>

 {/* Uploaded Files */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
 <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Uploaded Documents</h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <p className="font-medium text-gray-900 mb-2">KTM</p>
 <a 
 href={`/api/admin/registrations/${registration.id}/file?type=ktm`} 
 target="_blank" rel="noreferrer"
 className="inline-block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 :bg-gray-700 text-sm"
 >
 View KTM Document
 </a>
 </div>
 <div>
 <p className="font-medium text-gray-900 mb-2">Bukti Pembayaran</p>
 <a 
 href={`/api/admin/registrations/${registration.id}/file?type=payment`} 
 target="_blank" rel="noreferrer"
 className="inline-block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 :bg-gray-700 text-sm"
 >
 View Payment Proof
 </a>
 </div>
 </div>
 </div>
 </div>
 )
}
