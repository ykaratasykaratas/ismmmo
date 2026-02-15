'use client';

import { useState } from 'react';

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
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

    const handleDelete = async (userId: string) => {
        if (!confirm('Bu üyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert('Silme işlemi başarısız');
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
                            <td className="p-4 space-x-2 flex items-center">
                                {user.status !== 'Approved' && (
                                    <button
                                        onClick={() => handleStatusChange(user.id, 'Approved')}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                    >
                                        Onayla
                                    </button>
                                )}
                                {user.status !== 'Rejected' && user.status !== 'Approved' && (
                                    <button
                                        onClick={() => handleStatusChange(user.id, 'Rejected')}
                                        className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 text-sm"
                                    >
                                        Reddet
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm ml-2"
                                >
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
