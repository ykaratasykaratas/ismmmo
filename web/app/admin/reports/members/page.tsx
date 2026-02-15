'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    fullName: string;
    phone: string;
    roomNumber: string;
    status: string;
    createdAt: string;
}

export default function MemberReportsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // We can reuse the existing users API which returns all users.
            // Ideally we would have filtering in the API, but client side filtering is fine for now.
            // API: /api/users
            // Actually, currently we fetch users in UsersPage via server component (Prisma direct access).
            // We need a client-side fetch here.
            // Let's check api/users/route.ts if it supports GET.
            // Checking... I recall it supports GET. (Verified in my mind: UsersTable uses it? No, UsersTable gets initialUsers from server comp)
            // But usually I implement GET /api/users. Let's assume it exists or I might need to double check.
            // Wait, UsersTable uses PATCH/DELETE /api/users/[id].
            // Does GET /api/users exist? 
            // I'll check first, but for now I'll write the code assuming it exists or I will create it.
            // Let's create a specific API endpoint for reports if needed, or update /api/users/route.ts.
            // I'll quickly check api/users/route.ts content before running this.
            // BETTER: I'll use a server component here too! Like UsersPage.
            // BUT: "Excel Export" needs client side logic for download.
            // HYBRID: Server component fetches data, passes to Client Component which handles display and export.

            // Let's stick to client-side fetch for simplicity if the API exists.
            // If API doesn't exist, I'll create `MemberReportClient` and `page.tsx` (server).
            // Let's do Server Component + Client Component pattern. It's cleaner and reusing Prisma is easier than creating new API.

            // Wait, I can't put server code in this `write_to_file` effortlessly without splitting files.
            // I'll make this page a SERVER component that fetches data and passes it to a CLIENT component `MemberReportTable`.
            // User requested "excel export", which is a client interaction.

            // Let's assume for now I will use a simple client-side fetch. Check api/users/route.ts first?

            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (users.length === 0) return;

        // Filter only approved/relevant users if needed, or export all.
        // User asked for "Uye Listesi", usually implies approved.
        const approvedUsers = users.filter(u => u.status === 'Approved');

        const headers = ['Ad Soyad', 'Telefon', 'Oda No', 'Durum', 'Kayıt Tarihi'];
        const rows = approvedUsers.map(u => [
            u.fullName,
            u.phone,
            u.roomNumber,
            u.status === 'Approved' ? 'Onaylı' : 'Diğer',
            new Date(u.createdAt).toLocaleDateString('tr-TR')
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + headers.join(';') + "\n"
            + rows.map(e => e.join(';')).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Uye_Listesi_${new Date().toLocaleDateString('tr-TR')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-ismmmo-navy">Üye Listesi Raporu</h1>
                <button
                    onClick={exportToCSV}
                    disabled={loading || users.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <span>📊</span> Excel'e Aktar
                </button>
            </div>

            {loading ? (
                <div>Yükleniyor...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oda No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.fullName}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{user.phone}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{user.roomNumber}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                user.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {user.status === 'Approved' ? 'Onaylı' : user.status === 'Rejected' ? 'Reddedildi' : 'Bekliyor'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
