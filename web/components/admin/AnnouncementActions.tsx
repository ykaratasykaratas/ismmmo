'use client';

import { useRouter } from 'next/navigation';

export default function AnnouncementActions({ id, isPublished }: { id: string, isPublished: boolean }) {
    const router = useRouter();

    const handlePublish = async () => {
        if (!confirm('Bu taslağı yayınlamak istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/announcements/${id}/publish`, { method: 'POST' });
            if (res.ok) {
                alert('Duyuru yayınlandı!');
                router.refresh();
            } else {
                alert('Hata oluştu.');
            }
        } catch (e) {
            console.error(e);
            alert('Bağlantı hatası.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Silinemedi.');
            }
        } catch (e) {
            console.error(e);
            alert('Hata oluştu.');
        }
    };

    return (
        <div className="flex gap-2">
            {!isPublished && (
                <button
                    onClick={handlePublish}
                    className="text-green-600 hover:underline font-bold"
                >
                    Yayınla
                </button>
            )}
            <button
                onClick={() => router.push(`/admin/announcements/${id}/edit`)}
                className="text-blue-600 hover:underline font-bold"
            >
                Düzenle
            </button>
            <button
                onClick={handleDelete}
                className="text-red-600 hover:underline"
            >
                Sil
            </button>
        </div>
    );
}
