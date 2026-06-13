'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusUpdater({ 
 id, 
 currentStatus, 
 currentNotes 
}: { 
 id: string, 
 currentStatus: string, 
 currentNotes: string | null 
}) {
 const router = useRouter();
 const [status, setStatus] = useState(currentStatus);
 const [notes, setNotes] = useState(currentNotes || '');
 const [isSaving, setIsSaving] = useState(false);
 const [message, setMessage] = useState('');

 const handleSave = async () => {
 setIsSaving(true);
 setMessage('');
 try {
 const res = await fetch(`/api/admin/registrations/${id}`, {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ status, notes }),
 });
 if (res.ok) {
 setMessage('Updated successfully');
 router.refresh();
 } else {
 setMessage('Failed to update');
 }
 } catch (error) {
 setMessage('Error updating');
 } finally {
 setIsSaving(false);
 }
 };

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
 <h3 className="text-lg font-semibold text-gray-800 ">Update Status</h3>
 
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Status</label>
 <select 
 value={status} 
 onChange={(e) => setStatus(e.target.value)}
 className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 p-2 border"
 >
 <option value="PENDING">PENDING</option>
 <option value="CONTACTED">CONTACTED</option>
 <option value="ACCEPTED">ACCEPTED</option>
 <option value="REJECTED">REJECTED</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 ">Admin Notes</label>
 <textarea 
 value={notes} 
 onChange={(e) => setNotes(e.target.value)}
 rows={3}
 className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 p-2 border"
 placeholder="Internal notes..."
 />
 </div>

 <div className="flex items-center space-x-4">
 <button 
 onClick={handleSave} 
 disabled={isSaving}
 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:bg-blue-400"
 >
 {isSaving ? 'Saving...' : 'Save Changes'}
 </button>
 {message && <span className="text-sm text-gray-600 ">{message}</span>}
 </div>
 </div>
 );
}
