import Link from 'next/link';

export default function ReportsLandingPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-ismmmo-navy">Raporlar</h1>
            <p className="text-gray-500">Görüntülemek istediğiniz rapor türünü seçin.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Member List Card */}
                <Link href="/admin/reports/members" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-500 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">Üye Listesi</h2>
                            <span className="text-3xl bg-blue-100 p-3 rounded-full">👥</span>
                        </div>
                        <p className="text-gray-600 flex-1">
                            Sisteme kayıtlı tüm üyelerin listesini görüntüleyin, filtreleyin ve Excel formatında indirin.
                        </p>
                        <div className="mt-4 text-blue-600 font-semibold group-hover:underline">Listeyi Görüntüle &rarr;</div>
                    </div>
                </Link>

                {/* Event Reports Card */}
                <Link href="/admin/reports/events" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-green-500 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition">Etkinlik Raporları</h2>
                            <span className="text-3xl bg-green-100 p-3 rounded-full">📅</span>
                        </div>
                        <p className="text-gray-600 flex-1">
                            Düzenlenen etkinliklerin katılım durumlarını inceleyin ve katılımcı listelerini Excel olarak alın.
                        </p>
                        <div className="mt-4 text-green-600 font-semibold group-hover:underline">Raporları İncele &rarr;</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
