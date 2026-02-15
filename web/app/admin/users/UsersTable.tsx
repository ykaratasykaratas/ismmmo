'use client';

import { useState } from 'react';

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status: newStatus }),
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            } else {
                alert('Güncelleme başarısız');
            }
        } catch (e) {
            alert('Hata oluştu');
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-ismmmo-navy text-white">
                        <th className="p-4">Ad Soyad</th>
                        <th className="p-4">Telefon</th>
                        <th className="p-4">Oda No</th>
                        <th className="p-4">Durum</th>
                        <th className="p-4">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{user.fullName}</td>
                            <td className="p-4">{user.phone}</td>
                            <td className="p-4">{user.roomNumber}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        user.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-orange-100 text-orange-800'
                                    }`}>
                                    {user.status === 'Approved' ? 'Onaylı' :
                                        user.status === 'Rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                                </span>
                            </td>
                            <td className="p-4 space-x-2">
                                {user.status !== 'Approved' && (
                                    <button
                                        onClick={() => handleStatusChange(user.id, 'Approved')}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                    >
                                        Onayla
                                    </button>
                                )}
                                {user.status !== 'Rejected' && (
                                    <button
                                        onClick={() => handleStatusChange(user.id, 'Rejected')}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                    >
                                        Reddet
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
