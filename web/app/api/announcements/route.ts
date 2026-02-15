import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        console.log(`GET /api/announcements reached. CategoryId: ${categoryId}`);

        let whereClause: any = { isPublished: true };

        if (categoryId) {
            whereClause = {
                ...whereClause,
                OR: [
                    { targetCategoryId: categoryId },
                    { targetCategoryId: null }
                ]
            }
        }

        const announcements = await prisma.announcement.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { participations: true }
                }
            }
        });

        console.log(`Fetched ${announcements.length} published announcements`);
        return NextResponse.json(announcements);
    } catch (error: any) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json({ error: `Duyurular getirilemedi: ${error.message}` }, { status: 500 });
    }
}

export async function POST(request: Request) {
    console.log('POST /api/announcements reached');
    try {
        const body = await request.json();
        const { title, description, imageUrl, type, targetCategoryId, eventDate, locationName, latitude, longitude, action, maxParticipants, participationDeadline } = body;

        const isPublished = action === 'publish';
        console.log(`Payload: title=${title}, type=${type}, isPublished=${isPublished}`);

        const announcement = await prisma.announcement.create({
            data: {
                title,
                description,
                imageUrl,
                type,
                targetCategoryId: targetCategoryId === 'All' ? null : targetCategoryId,
                eventDate: eventDate ? new Date(eventDate) : null,
                locationName,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
                participationDeadline: participationDeadline ? new Date(participationDeadline) : null,
                isPublished,
            }
        });

        console.log(`Successfully saved to DB! ID: ${announcement.id}`);

        // Send Notification ONLY if published
        if (isPublished) {
            console.log('Attempting to send notifications...');
            try {
                const { getFirebaseMessaging } = await import('@/lib/firebase-admin');
                const messaging = getFirebaseMessaging();

                const devices = await prisma.deviceToken.findMany({ select: { token: true } });
                const tokens = devices.map(d => d.token).filter(t => t);
                console.log(`Found ${tokens.length} device tokens`);

                if (tokens.length > 0) {
                    const message = {
                        notification: {
                            title: 'Yeni Duyuru: ' + title,
                            body: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
                        },
                        data: {
                            type: 'announcement',
                            id: announcement.id,
                            click_action: 'FLUTTER_NOTIFICATION_CLICK',
                        },
                        tokens: tokens,
                    };

                    const response = await messaging.sendEachForMulticast(message);
                    console.log(`Firebase response: ${response.successCount} success, ${response.failureCount} failure`);
                } else {
                    console.log('No tokens found to send.');
                }
            } catch (pushError: any) {
                console.error('Push notification error:', pushError.message || pushError);
            }
        }

        return NextResponse.json(announcement, { status: 201 });
    } catch (error: any) {
        console.error('Announcement creation error:', error);
        return NextResponse.json({
            error: `Duyuru oluşturulamadı: ${error.message || 'Bilinmeyen hata'}`,
            details: error
        }, { status: 500 });
    }
}
