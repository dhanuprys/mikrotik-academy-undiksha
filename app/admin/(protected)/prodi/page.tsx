'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin-page-header';

interface Prodi {
 id: string;
 name: string;
 degree: string;
 requiredCourses: string;
}

export default function ProdiPage() {
 const [prodis, setProdis] = useState<Prodi[]>([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);

 const fetchProdis = async () => {
 setLoading(true);
 const res = await fetch('/api/admin/prodi');
 const data = await res.json();
 setProdis(data);
 setLoading(false);
 };

 useEffect(() => {
 fetchProdis();
 }, []);

 const handleDelete = async (id: string) => {
 if (!confirm('Are you sure you want to delete this Program Studi? This might fail if there are registrations tied to it.')) return;
 await fetch(`/api/admin/prodi/${id}`, { method: 'DELETE' });
 fetchProdis();
 };

 const openModal = (prodi: Prodi | null = null) => {
 setEditingProdi(prodi);
 setIsModalOpen(true);
 };

 const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 const formData = new FormData(e.currentTarget);
 const data = Object.fromEntries(formData.entries());

 const method = editingProdi ? 'PATCH' : 'POST';
 const url = editingProdi ? `/api/admin/prodi/${editingProdi.id}` : '/api/admin/prodi';

 await fetch(url, {
 method,
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(data),
 });

 setIsModalOpen(false);
 fetchProdis();
 };

 return (
 <div className="space-y-6">
      <AdminPageHeader 
        title="Program Studi"
        description="Manage available study programs"
        action={
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Add Program Studi
          </button>
        }
      />

 {loading ? (
 <p>Loading...</p>
 ) : (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
 <table className="min-w-full divide-y divide-gray-200 ">
 <thead className="bg-gray-50 ">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Courses</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200 ">
 {prodis.map(prodi => (
 <tr key={prodi.id}>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">{prodi.name}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{prodi.degree}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{prodi.requiredCourses}</td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
 <button onClick={() => openModal(prodi)} className="text-indigo-600 hover:text-indigo-900 :text-indigo-400">Edit</button>
 <button onClick={() => handleDelete(prodi.id)} className="text-red-600 hover:text-red-900 :text-red-400">Delete</button>
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
 {editingProdi ? 'Edit Program Studi' : 'Create Program Studi'}
 </h3>
 <form onSubmit={handleSave} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Name</label>
 <input required type="text" name="name" defaultValue={editingProdi?.name} className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 border text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Degree (e.g. S1, D4)</label>
 <input required type="text" name="degree" defaultValue={editingProdi?.degree} className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 border text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Required Courses for Eligibility</label>
 <input required type="text" name="requiredCourses" defaultValue={editingProdi?.requiredCourses} className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 border text-gray-900 " />
 </div>
 <div className="flex justify-end space-x-3 mt-6">
 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 :bg-gray-600">Cancel</button>
 <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save</button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
