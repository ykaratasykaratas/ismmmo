'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex h-screen bg-ismmmo-gray">
            {/* Sidebar */}
            <aside className="w-64 bg-ismmmo-navy text-white flex flex-col">
                <div className="p-6 border-b border-indigo-800 flex flex-col items-center text-center">
                    <div className="bg-white p-2 rounded-lg mb-3">
                        <Image
                            src="/ismmmologo.png"
                            alt="İSMMMO Logo"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                    {/* <div className="font-bold text-lg leading-tight">İSMMMO</div> */}
                    <div className="text-xl font-bold text-white mt-1">Kartal Temsilciliği</div>
                    <div className="text-xs text-indigo-300 mt-1 uppercase tracking-wider">İLETİŞİM SİSTEMİ</div>
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
                        💹 Raporlar
                    </Link>
                    <Link href="/admin/settings" className="block p-3 rounded hover:bg-indigo-800">
                        ⚙️ Ayarlar
                    </Link>
                </nav>
                <div className="p-4 border-t border-indigo-800">
                    <button
                        onClick={handleLogout}
                        className="w-full p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
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
