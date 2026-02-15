'use client';

import { useState, useEffect } from 'react';

interface Announcement {
    id: string;
    title: string;
    eventDate: string | null;
    type: 'Announcement' | 'Event';
    _count?: {
        participations: number;
    };
}

interface Participant {
    id: string;
    user: {
        fullName: string;
        phone: string;
        roomNumber: string;
    };
    plusCount: number;
    totalComing: number;
    createdAt: string;
}

export default function EventReportsPage() {
    const [events, setEvents] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Announcement | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/announcements');
            const data = await res.json();
            const eventList = data.filter((item: Announcement) => item.type === 'Event');
            setEvents(eventList);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async (announcementId: string) => {
        setLoadingParticipants(true);
        try {
            const res = await fetch(`/api/participations?announcementId=${announcementId}`);
            const data = await res.json();
            setParticipants(data);
        } catch (error) {
            console.error('Error fetching participants:', error);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleViewDetails = (event: Announcement) => {
        setSelectedEvent(event);
        fetchParticipants(event.id);
    };

    const closeDetails = () => {
        setSelectedEvent(null);
        setParticipants([]);
    };

    const exportToCSV = () => {
        if (!selectedEvent || participants.length === 0) return;

        const headers = ['Ad Soyad', 'Telefon', 'Oda No', 'Ek Kişi', 'Toplam', 'Kayıt Tarihi'];
        const rows = participants.map(p => [
            p.user.fullName,
            p.user.phone,
            p.user.roomNumber,
            p.plusCount,
            p.totalComing,
            new Date(p.createdAt).toLocaleDateString('tr-TR')
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + headers.join(';') + "\n"
            + rows.map(e => e.join(';')).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedEvent.title}_Katilim_Listesi.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-ismmmo-navy">Etkinlik Raporları</h1>

            {loading ? (
                <div>Yükleniyor...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etkinlik Adı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Katılım Sayısı</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{event.title}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{event.eventDate ? new Date(event.eventDate).toLocaleDateString('tr-TR') : '-'}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{event._count?.participations || 0} Kişi</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleViewDetails(event)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Detaylar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{selectedEvent.title} - Katılımcı Listesi</h2>
                                <p className="text-sm text-gray-500 mt-1">Toplam Başvuru: {participants.length}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 flex items-center gap-2">
                                    <span>📊</span> Excel'e Aktar
                                </button>
                                <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {loadingParticipants ? (
                                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                            ) : participants.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Oda No</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ek Kişi</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Toplam</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {participants.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{p.user.fullName}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{p.user.phone}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{p.user.roomNumber}</td>
                                                <td className="px-4 py-2 text-sm text-center text-gray-500">+{p.plusCount}</td>
                                                <td className="px-4 py-2 text-sm text-center font-bold text-gray-900">{p.totalComing}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">Bu etkinlik için henüz katılım kaydı bulunmuyor.</div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end">
                            <button onClick={closeDetails} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">Kapat</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
