'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin-page-header';

interface User {
 id: string;
 name: string;
 email: string;
 createdAt: string;
}

export default function UsersPage() {
 const [users, setUsers] = useState<User[]>([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingUser, setEditingUser] = useState<User | null>(null);
 const [errorMsg, setErrorMsg] = useState('');

 const fetchUsers = async () => {
 setLoading(true);
 const res = await fetch('/api/admin/users');
 const data = await res.json();
 setUsers(data);
 setLoading(false);
 };

 useEffect(() => {
 fetchUsers();
 }, []);

 const handleDelete = async (id: string) => {
 if (!confirm('Are you sure you want to delete this user?')) return;
 const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
 if (!res.ok) {
 const data = await res.json();
 alert(data.error || 'Failed to delete');
 }
 fetchUsers();
 };

 const openModal = (user: User | null = null) => {
 setEditingUser(user);
 setErrorMsg('');
 setIsModalOpen(true);
 };

 const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setErrorMsg('');
 const formData = new FormData(e.currentTarget);
 const data = Object.fromEntries(formData.entries());

 if (!editingUser && !data.password) {
 setErrorMsg('Password is required for new users');
 return;
 }

 const method = editingUser ? 'PATCH' : 'POST';
 const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';

 const res = await fetch(url, {
 method,
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(data),
 });

 if (!res.ok) {
 const errData = await res.json();
 setErrorMsg(errData.error || 'Failed to save');
 return;
 }

 setIsModalOpen(false);
 fetchUsers();
 };

 return (
 <div className="space-y-6">
      <AdminPageHeader 
        title="Admin Users"
        description="Manage administrator accounts"
        action={
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Add User
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
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username/Email</th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200 ">
 {users.map(user => (
 <tr key={user.id}>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">{user.name}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{user.email}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{new Date(user.createdAt).toLocaleDateString()}</td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
 <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 :text-indigo-400">Edit</button>
 <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 :text-red-400">Delete</button>
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
 {editingUser ? 'Edit User' : 'Create User'}
 </h3>
 {errorMsg && <div className="mb-4 text-red-600 text-sm">{errorMsg}</div>}
 <form onSubmit={handleSave} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Name</label>
 <input required type="text" name="name" defaultValue={editingUser?.name} className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 border text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">Username/Email</label>
 <input required type="text" name="email" defaultValue={editingUser?.email} className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 border text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 ">
 Password {editingUser && '(Leave blank to keep current)'}
 </label>
 <input type="password" name="password" className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 border text-gray-900 " />
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
