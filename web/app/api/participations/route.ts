import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { announcementId, userId, plusCount } = body;

        // Check if duplicate
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
