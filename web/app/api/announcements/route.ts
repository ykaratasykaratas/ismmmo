import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        let whereClause = {};

        if (categoryId) {
            whereClause = {
                OR: [
                    { targetCategoryId: categoryId },
                    { targetCategoryId: null } // Show 'All' or general announcements too? 
                    // Requirement: "target_category: Relation (Categories table or 'All')"
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
        const { title, description, imageUrl, type, targetCategoryId, eventDate } = body;

        const announcement = await prisma.announcement.create({
            data: {
                title,
                description,
                imageUrl,
                type,
                targetCategoryId: targetCategoryId === 'All' ? null : targetCategoryId,
                eventDate: eventDate ? new Date(eventDate) : null,
            }
        });

        // Send Notification
        // Ideally this should be in a background job or queue, but for simplicity we do it here inside try/catch block (non-blocking if we don't await, or blocking if we do. Let's make it async but not block response too much, or just await it if crucial).
        try {
            const { getFirebaseMessaging } = await import('@/lib/firebase-admin');
            const messaging = getFirebaseMessaging(); // Get the instance safely

            const devices = await prisma.deviceToken.findMany({ select: { token: true } });
            const tokens = devices.map(d => d.token).filter(t => t);

            if (tokens.length > 0) {
                // Construct message appropriately for sendEachForMulticast
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
            // Don't fail the request if push fails, just log it.
        }

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json({ error: 'Duyuru oluşturulamadı.' }, { status: 500 });
    }
}
