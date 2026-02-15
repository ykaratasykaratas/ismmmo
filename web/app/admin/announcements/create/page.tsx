'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAnnouncementPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        type: 'Standard', // or Event
        eventDate: '',
        targetCategoryId: 'All'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Duyuru oluşturuldu!');
                router.push('/admin/dashboard');
            } else {
                alert('Hata oluştu');
            }
        } catch (e) {
            alert('Bağlantı hatası');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-ismmmo-navy mb-6">Yeni Duyuru Oluştur</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Başlık</label>
                    <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">İçerik</label>
                    <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 h-32"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tip</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Standard">Standart Duyuru</option>
                            <option value="Event">Etkinlik</option>
                        </select>
                    </div>

                    {formData.type === 'Event' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Etkinlik Tarihi</label>
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                required
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-ismmmo-orange text-white p-3 rounded-lg font-bold hover:bg-orange-700 transition">
                    Yayınla & Bildirim Gönder
                </button>
            </form>
        </div>
    );
}
