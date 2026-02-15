import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

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

        return NextResponse.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json({ error: 'Duyurular getirilemedi.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, imageUrl, type, targetCategoryId, eventDate, locationName, latitude, longitude, action, maxParticipants, participationDeadline } = body;

        const isPublished = action === 'publish';

        console.log(`Creating announcement: ${title}, type: ${type}, isPublished: ${isPublished}`);

        const announcement = await prisma.announcement.create({
            data: {
                title,
                description,
                imageUrl,
                type,
                targetCategoryId: targetCategoryId === 'All' ? null : targetCategoryId,
                eventDate: eventDate ? new Date(eventDate) : null,
                locationName,
                latitude,
                longitude,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
                participationDeadline: participationDeadline ? new Date(participationDeadline) : null,
                isPublished,
            }
        });

        console.log(`Announcement created successfully with ID: ${announcement.id}`);

        // Send Notification ONLY if published
        if (isPublished) {
            try {
                const { getFirebaseMessaging } = await import('@/lib/firebase-admin');
                const messaging = getFirebaseMessaging();

                const devices = await prisma.deviceToken.findMany({ select: { token: true } });
                const tokens = devices.map(d => d.token).filter(t => t);

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
                    console.log(`Notification sent: ${response.successCount} success, ${response.failureCount} failure`);
                }
            } catch (pushError) {
                console.error('Error sending push notification:', pushError);
            }
        }

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json({ error: 'Duyuru oluşturulamadı.' }, { status: 500 });
    }
}
