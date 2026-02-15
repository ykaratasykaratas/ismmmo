import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
    const totalUsers = await prisma.user.count();
    const pendingUsers = await prisma.user.count({ where: { status: 'Pending' } });
    const totalAnnouncements = await prisma.announcement.count();
    const recentParticipations = await prisma.participation.count();

    return (
        <div>
            <h1 className="text-3xl font-bold text-ismmmo-navy mb-8">Yönetici Özeti</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-ismmmo-navy">
                    <h3 className="text-gray-500 text-sm uppercase">Toplam Üye</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{totalUsers}</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-ismmmo-orange">
                    <h3 className="text-gray-500 text-sm uppercase">Bekleyen Onay</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{pendingUsers}</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm uppercase">Aktif Duyurular</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{totalAnnouncements}</p>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm uppercase">Toplam Katılım</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{recentParticipations}</p>
                </div>
            </div>
        </div>
    );
}
