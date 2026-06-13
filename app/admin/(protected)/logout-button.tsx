'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
 const router = useRouter();

 const handleLogout = async () => {
 await fetch('/api/auth/logout', { method: 'POST' });
 router.push('/admin/login');
 router.refresh();
 };

 return (
 <button
 onClick={handleLogout}
 className="text-sm font-medium text-red-600 hover:text-red-800 :text-red-300"
 >
 Logout
 </button>
 );
}
