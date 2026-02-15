import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-ismmmo-gray">
            {/* Sidebar */}
            <aside className="w-64 bg-ismmmo-navy text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-indigo-800">
                    İSMMMO Admin
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="block p-3 rounded hover:bg-indigo-800">
                        📊 Dashboard
                    </Link>
                    <Link href="/admin/users" className="block p-3 rounded hover:bg-indigo-800">
                        👥 Üye Yönetimi
                    </Link>
                    <Link href="/admin/announcements" className="block p-3 rounded hover:bg-indigo-800">
                        📢 Duyurular
                    </Link>
                    <Link href="/admin/reports" className="block p-3 rounded hover:bg-indigo-800">
                        📅 Etkinlik Raporları
                    </Link>
                </nav>
                <div className="p-4 border-t border-indigo-800">
                    <button className="w-full p-2 bg-red-600 rounded hover:bg-red-700">
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
