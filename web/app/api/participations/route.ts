import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { announcementId, userId, plusCount } = body;

        // 1. Check if user already participating
        const existingParticipation = await prisma.participation.findFirst({
            where: {
                announcementId,
                userId
            }
        });

        if (existingParticipation) {
            return NextResponse.json(
                { error: 'Zaten katılım bildirdiniz.' },
                { status: 400 }
            );
        }

        // 2. Fetch announcement details to check limits
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcementId },
            include: {
                _count: {
                    select: { participations: true }
                }
            }
        });

        if (!announcement) {
            return NextResponse.json({ error: 'Duyuru bulunamadı.' }, { status: 404 });
        }

        // 3. Check Deadline
        if (announcement.participationDeadline && new Date() > new Date(announcement.participationDeadline)) {
            return NextResponse.json(
                { error: 'Katılım süresi doldu.' },
                { status: 400 }
            );
        }

        // 4. Check Quota (Max Participants)
        // Note: We count current participants. If limit is 100, and 100 people are there, we block.
        // Simplified logic: each participation counts as 1 + plusCount. 
        // For strict quota, we should aggregate the total attendance, but counting rows is a good approximation if plusCount is rarely used or low.
        // Let's stick to row count for simplicity or aggregate if needed. 
        // The user requirement says "x kişi ile sınırlı". Assuming total headcount.

        if (announcement.maxParticipants) {
            const currentTotal = await prisma.participation.aggregate({
                where: { announcementId },
                _sum: { totalComing: true }
            });

            const totalAttendees = (currentTotal._sum.totalComing || 0);
            const newAttendees = 1 + (plusCount || 0);

            if (totalAttendees + newAttendees > announcement.maxParticipants) {
                return NextResponse.json(
                    { error: 'Kontenjan dolu.' },
                    { status: 400 }
                );
            }
        }

        const participation = await prisma.participation.create({
            data: {
                announcementId,
                userId,
                plusCount: plusCount || 0,
                totalComing: 1 + (plusCount || 0)
            },
        });

        return NextResponse.json(participation, { status: 201 });
    } catch (error) {
        console.error('Error creating participation:', error);
        return NextResponse.json(
            { error: 'Katılım bildirilemedi.' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const announcementId = searchParams.get('announcementId');

        if (!announcementId) {
            return NextResponse.json({ error: 'Announcement ID required' }, { status: 400 });
        }

        const participations = await prisma.participation.findMany({
            where: { announcementId },
            include: {
                user: {
                    select: {
                        fullName: true,
                        phone: true,
                        roomNumber: true
                    }
                }
            }
        });

        return NextResponse.json(participations);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching participations' }, { status: 500 });
    }
}
