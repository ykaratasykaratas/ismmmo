import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AnnouncementsPage() {
    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { participations: true }
            }
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-ismmmo-navy">Duyurular</h1>
                <Link
                    href="/admin/announcements/create"
                    className="bg-ismmmo-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700"
                >
                    + Yeni Duyuru
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-ismmmo-navy text-white">
                        <tr>
                            <th className="p-4">Başlık</th>
                            <th className="p-4">Tip</th>
                            <th className="p-4">Tarih</th>
                            <th className="p-4">Katılım</th>
                            <th className="p-4">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{item.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'Event' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {item.type === 'Event' ? 'Etkinlik' : 'Duyuru'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="p-4">
                                    {item.type === 'Event' ? (
                                        <span className="font-bold text-lg">{item._count.participations} kişi</span>
                                    ) : '-'}
                                </td>
                                <td className="p-4">
                                    <button className="text-blue-600 hover:underline mr-2">Düzenle</button>
                                    <button className="text-red-600 hover:underline">Sil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
