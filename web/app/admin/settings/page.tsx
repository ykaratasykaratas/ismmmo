'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: `Bir hata oluştu: ${err.message || err}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>

            {/* Password Change Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Şifre Değiştir</h2>

                {message.text && (
                    <div className={`p-4 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-ismmmo-navy outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-ismmmo-navy outline-none"
                                minLength={6}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-ismmmo-navy outline-none"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-ismmmo-navy text-white px-6 py-2 rounded-lg hover:bg-indigo-900 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile App Version Section */}
            <MobileVersionSettings />
        </div>
    );
}

function MobileVersionSettings() {
    const [version, setVersion] = useState('');
    const [url, setUrl] = useState('');
    const [forceUpdate, setForceUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Load initial data
    useState(() => {
        fetch('/api/mobile-version')
            .then(res => res.json())
            .then(data => {
                if (data.version) setVersion(data.version);
                if (data.url) setUrl(data.url);
                if (data.forceUpdate !== undefined) setForceUpdate(data.forceUpdate);
            })
            .catch(err => console.error(err));
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const res = await fetch('/api/mobile-version', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ version, url, forceUpdate }),
            });

            if (res.ok) {
                setMsg({ type: 'success', text: 'Mobil sürüm ayarları güncellendi.' });
            } else {
                setMsg({ type: 'error', text: 'Güncelleme başarısız.' });
            }
        } catch (error) {
            setMsg({ type: 'error', text: 'Hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mobil Uygulama Sürümü</h2>

            {msg.text && (
                <div className={`p-4 rounded-lg mb-4 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Sürüm No</label>
                        <input
                            type="text"
                            placeholder="1.0.1"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-ismmmo-navy outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zorunlu Güncelleme</label>
                        <div className="flex items-center h-10">
                            <input
                                type="checkbox"
                                id="forceUpdate"
                                checked={forceUpdate}
                                onChange={(e) => setForceUpdate(e.target.checked)}
                                className="w-5 h-5 text-ismmmo-navy rounded focus:ring-ismmmo-navy border-gray-300"
                            />
                            <label htmlFor="forceUpdate" className="ml-2 text-sm text-gray-700 select-none">
                                Evet, kullanıcı güncellemeli
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İndirme Linki (App Store / Play Store / APK)</label>
                    <input
                        type="url"
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-ismmmo-navy outline-none"
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-ismmmo-orange text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
