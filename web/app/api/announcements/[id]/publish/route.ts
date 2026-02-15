import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/announcements/[id]/publish
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const announcementId = id;

        const announcement = await prisma.announcement.update({
            where: { id: announcementId },
            data: { isPublished: true },
        });

        // Send Notification
        try {
            const { getFirebaseMessaging } = await import('@/lib/firebase-admin');
            const messaging = getFirebaseMessaging();

            const devices = await prisma.deviceToken.findMany({ select: { token: true } });
            const tokens = devices.map(d => d.token).filter(t => t);

            if (tokens.length > 0) {
                const message = {
                    notification: {
                        title: 'Yeni Duyuru: ' + announcement.title,
                        body: announcement.description.substring(0, 100) + (announcement.description.length > 100 ? '...' : ''),
                    },
                    data: {
                        type: 'announcement',
                        id: announcement.id,
                        click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                    tokens: tokens,
                };

                const response = await messaging.sendEachForMulticast(message);
                console.log(`Notification sent: ${response.successCount} success, ${response.failureCount} failure`);
            }
        } catch (pushError) {
            console.error('Error sending push notification:', pushError);
            // Don't fail the request if push fails, just log it
        }

        return NextResponse.json({ message: 'Duyuru yayınlandı ve bildirim gönderildi' });
    } catch (error) {
        console.error('Error publishing announcement:', error);
        return NextResponse.json({ error: 'Duyuru yayınlanamadı' }, { status: 500 });
    }
}
