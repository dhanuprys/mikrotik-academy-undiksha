'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin-page-header';

interface EventData {
 id: string;
 title: string;
 description: string | null;
 startDate: string;
 endDate: string;
 isActive: boolean;
 isDraft: boolean;
 posterPath: string | null;
}

export default function EventsPage() {
 const router = useRouter();
 const [events, setEvents] = useState<EventData[]>([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

 useEffect(() => {
 fetchEvents();
 }, []);

 async function fetchEvents() {
 setLoading(true);
 const res = await fetch('/api/admin/events');
 const data = await res.json();
 setEvents(data);
 setLoading(false);
 };

 const handleActivate = async (id: string) => {
 if (!confirm('This will deactivate any currently active event. Continue?')) return;
 await fetch(`/api/admin/events/${id}/activate`, { method: 'POST' });
 fetchEvents();
 router.refresh();
 };

 const handleDelete = async (id: string) => {
 if (!confirm('Are you sure you want to delete this event?')) return;
 await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
 fetchEvents();
 };

 const openModal = (event: EventData | null = null) => {
 setEditingEvent(event);
 setIsModalOpen(true);
 };

 const closeModal = () => {
 setIsModalOpen(false);
 setEditingEvent(null);
 };

 const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 const formData = new FormData(e.currentTarget);
 
 // Convert to ISO string for the API
 formData.set('startDate', new Date(formData.get('startDate') as string).toISOString());
 formData.set('endDate', new Date(formData.get('endDate') as string).toISOString());
 
 const isDraftValue = (e.currentTarget.elements.namedItem('isDraft') as HTMLInputElement).checked;
 formData.set('isDraft', isDraftValue ? 'true' : 'false');

 const method = editingEvent ? 'PATCH' : 'POST';
 const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : '/api/admin/events';

 await fetch(url, {
 method,
 body: formData, // Sending FormData to handle file uploads
 });

 closeModal();
 fetchEvents();
 router.refresh();
 };

 return (
  <div className="space-y-6">
      <AdminPageHeader 
        title="Events Management"
        description="Manage Mikrotik Academy certification periods"
        action={
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Create Event
          </button>
        }
      />

 {loading ? (
 <p>Loading events...</p>
 ) : (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
 <table className="min-w-full divide-y divide-gray-200 ">
 <thead className="bg-gray-50 ">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200 ">
 {events.map((event) => (
 <tr key={event.id}>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
 {event.title}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {event.isActive ? (
 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
 ) : event.isDraft ? (
 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Draft</span>
 ) : (
 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Published</span>
 )}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
 {!event.isActive && !event.isDraft && (
 <button onClick={() => handleActivate(event.id)} className="text-green-600 hover:text-green-900 :text-green-400">Activate</button>
 )}
 <button onClick={() => openModal(event)} className="text-indigo-600 hover:text-indigo-900 :text-indigo-400">Edit</button>
 <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900 :text-red-400">Delete</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {isModalOpen && (
 <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-xl max-w-md w-full p-6">
 <h3 className="text-lg font-bold mb-4 text-gray-900 ">
 {editingEvent ? 'Edit Event' : 'Create Event'}
 </h3>
 <form onSubmit={handleSave} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Title</label>
 <input required type="text" name="title" defaultValue={editingEvent?.title} className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 p-2 border" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Description</label>
 <textarea name="description" defaultValue={editingEvent?.description || ''} className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 p-2 border" rows={3} />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Start Date</label>
 <input required type="date" name="startDate" defaultValue={editingEvent?.startDate ? new Date(editingEvent.startDate).toISOString().split('T')[0] : ''} className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 p-2 border" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">End Date</label>
 <input required type="date" name="endDate" defaultValue={editingEvent?.endDate ? new Date(editingEvent.endDate).toISOString().split('T')[0] : ''} className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 p-2 border" />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Poster Image (Optional)</label>
 <input type="file" name="poster" accept="image/jpeg,image/png" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
 </div>
 <div className="flex items-center mt-4">
 <input type="checkbox" name="isDraft" id="isDraft" defaultChecked={editingEvent ? editingEvent.isDraft : true} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
 <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-900 ">Save as Draft (Hidden)</label>
 </div>
 <div className="flex justify-end space-x-3 mt-6">
 <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 :bg-gray-600">Cancel</button>
 <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Event</button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
