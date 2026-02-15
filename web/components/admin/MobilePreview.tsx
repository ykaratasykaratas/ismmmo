'use client';

interface MobilePreviewProps {
    title: string;
    description: string;
    imageUrl?: string;
    type: 'Standard' | 'Event';
    eventDate?: string;
    locationName?: string;
}

export default function MobilePreview({ title, description, imageUrl, type, eventDate, locationName }: MobilePreviewProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <div className="border-[12px] border-gray-800 rounded-[3rem] h-[600px] w-[320px] bg-gray-50 overflow-hidden shadow-2xl relative">
            {/* Status Bar Mockup */}
            <div className="bg-ismmmo-navy h-8 w-full flex justify-between items-center px-4 text-[10px] text-white">
                <span>09:41</span>
                <div className="flex gap-1">
                    <span>📶</span>
                    <span>🔋</span>
                </div>
            </div>

            {/* App Header Mockup */}
            <div className="bg-ismmmo-navy text-white p-4 pb-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs opacity-80">Hoş geldin,</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                </div>
                <h2 className="font-bold">Yunus Emre</h2>
            </div>

            {/* Content Area */}
            <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                    {/* Badge */}
                    <div className="px-3 py-2 flex justify-between items-start">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${type === 'Event' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {type === 'Event' ? 'Etkinlik' : 'Duyuru'}
                        </span>
                        <span className="text-[10px] text-gray-400">Şimdi</span>
                    </div>

                    {/* Image */}
                    {imageUrl && (
                        <div className="h-40 w-full overflow-hidden">
                            <img src={imageUrl} alt="Kapak" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-3">
                        {type === 'Event' && eventDate && (
                            <div className="flex items-center gap-2 text-xs text-ismmmo-orange font-semibold mb-1">
                                <span>📅</span>
                                <span>{formatDate(eventDate)}</span>
                            </div>
                        )}

                        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">
                            {title || 'Başlık Buraya Gelecek'}
                        </h3>

                        {locationName && (
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                                <span>📍</span>
                                <span>{locationName}</span>
                            </div>
                        )}

                        <p className="text-xs text-gray-600 line-clamp-[10] whitespace-pre-wrap">
                            {description || 'İçerik önizlemesi burada görünecek...'}
                        </p>

                        {/* Action Mockup */}
                        <div className="mt-3 flex gap-2">
                            <div className="flex-1 bg-ismmmo-navy text-white text-center py-1.5 rounded text-xs font-medium">
                                {type === 'Event' ? 'Katıl' : 'Detay'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Mockup */}
            <div className="absolute bottom-0 w-full h-12 bg-white border-t flex justify-around items-center px-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-10 h-10 bg-ismmmo-orange rounded-full -mt-6 border-4 border-gray-50"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
}
