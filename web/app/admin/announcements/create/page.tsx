'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import MobilePreview from '@/components/admin/MobilePreview';

// Dynamically import LeafletMap with SSR disabled to prevent "window is not defined" error
const LeafletMap = dynamic(() => import('@/components/admin/LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse flex items-center justify-center">Harita Yükleniyor...</div>
});

export default function CreateAnnouncementPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        type: 'Standard', // or Event
        eventDate: '',
        targetCategoryId: 'All',
        locationName: '',
        latitude: 0,
        longitude: 0,
        maxParticipants: '',
        participationDeadline: '',
    });

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const json = await res.json();
                setFormData(prev => ({ ...prev, imageUrl: json.url }));
            } else {
                alert('Resim yüklenemedi.');
            }
        } catch (err) {
            console.error(err);
            alert('Yükleme hatası.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.MouseEvent, action: 'draft' | 'publish') => {
        e.preventDefault();
        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, action }),
            });

            if (res.ok) {
                alert(action === 'publish' ? 'Duyuru yayınlandı!' : 'Taslak kaydedildi.');
                router.push('/admin/dashboard');
            } else {
                alert('Hata oluştu');
            }
        } catch (e) {
            alert('Bağlantı hatası');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="flex-1 bg-white p-8 rounded-xl shadow h-fit">
                <h1 className="text-2xl font-bold text-ismmmo-navy mb-6">Yeni Duyuru Oluştur</h1>

                <form className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Başlık</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tip</label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Standard">Standart Duyuru</option>
                                    <option value="Event">Etkinlik</option>
                                </select>
                            </div>
                            {formData.type === 'Event' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Etkinlik Tarihi</label>
                                        <input
                                            type="datetime-local"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Son Katılım Tarihi (Opsiyonel)</label>
                                        <input
                                            type="datetime-local"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                            value={formData.participationDeadline}
                                            onChange={(e) => setFormData({ ...formData, participationDeadline: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa süre kısıtlaması olmaz.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kontenjan (Opsiyonel)</label>
                                        <input
                                            type="number"
                                            placeholder="Örn: 100"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                            value={formData.maxParticipants}
                                            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa sınırsız katılım olur.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">İçerik</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 h-32 focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kapak Resmi</label>
                            <div className="mt-1 flex items-center gap-4">
                                <label className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span>Dosya Seç</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="sr-only"
                                    />
                                </label>
                                <span className="text-sm text-gray-500">
                                    {uploading ? 'Yükleniyor...' : (formData.imageUrl ? 'Resim yüklendi ✅' : 'Resim seçilmedi')}
                                </span>
                            </div>
                            {formData.imageUrl && (
                                <div className="mt-2 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.imageUrl} alt="Uploaded" className="h-20 w-auto rounded border" />
                                </div>
                            )}
                        </div>

                        {/* Map Section */}
                        {formData.type === 'Event' && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-700 mb-2">Etkinlik Konumu</h3>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mekan Adı</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Hasan Ali Yücel Kültür Merkezi"
                                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-ismmmo-navy focus:border-ismmmo-navy"
                                        value={formData.locationName}
                                        onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                                    />
                                </div>
                                <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
                                    <LeafletMap onLocationSelect={handleLocationSelect} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    * Haritaya tıklayarak konum işaretleyebilirsiniz.
                                    {formData.latitude !== 0 && (
                                        <span className="text-green-600 font-bold ml-1">
                                            (Seçildi: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)})
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex gap-4">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'draft')}
                            disabled={uploading}
                            className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            💾 Taslak Kaydet
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'publish')}
                            disabled={uploading}
                            className="flex-1 bg-ismmmo-orange text-white p-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
                        >
                            🚀 Yayınla & Bildirim Gönder
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Section */}
            <div className="flex-1 flex flex-col items-center justify-start py-8 lg:py-0 sticky top-8 h-fit">
                <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">Mobil Önizleme</h3>
                <MobilePreview
                    title={formData.title}
                    description={formData.description}
                    imageUrl={formData.imageUrl}
                    type={formData.type as any}
                    eventDate={formData.eventDate}
                    locationName={formData.locationName}
                />
                <p className="text-sm text-gray-400 mt-4 text-center max-w-xs">
                    * Bu önizleme, uygulamanın ana ekranındaki kart görünümünü temsil eder.
                </p>
            </div>
        </div>
    );
}
