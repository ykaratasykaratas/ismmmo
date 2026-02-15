import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// GET /api/announcements/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const announcement = await prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) {
            return NextResponse.json({ error: 'Duyuru bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(announcement);
    } catch (error) {
        return NextResponse.json({ error: 'Hata' }, { status: 500 });
    }
}

// DELETE /api/announcements/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const announcementId = id;

        // Check if announcement exists
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcementId },
        });

        if (!announcement) {
            return NextResponse.json({ error: 'Duyuru bulunamadı' }, { status: 404 });
        }

        // Delete associated image if it exists (optional, good practice)
        if (announcement.imageUrl && announcement.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(process.cwd(), 'public', announcement.imageUrl);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (e) {
                    console.error('Error deleting image file:', e);
                }
            }
        }

        // Delete participations first
        await prisma.participation.deleteMany({
            where: { announcementId: announcementId },
        });

        // Delete announcement
        await prisma.announcement.delete({
            where: { id: announcementId },
        });

        return NextResponse.json({ message: 'Duyuru başarıyla silindi' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json({ error: 'Duyuru silinemedi' }, { status: 500 });
    }
}

// PATCH /api/announcements/[id] - For general updates (Edit feature)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const announcementId = id;
        const body = await req.json();

        // Exclude fields that shouldn't be updated directly
        const { id: _, isPublished, targetCategoryId, eventDate, participationDeadline, ...rest } = body;

        const updateData: any = {
            ...rest,
            targetCategoryId: targetCategoryId === 'All' ? null : targetCategoryId,
            eventDate: eventDate ? new Date(eventDate) : null,
            participationDeadline: participationDeadline ? new Date(participationDeadline) : null,
        };

        const updatedAnnouncement = await prisma.announcement.update({
            where: { id: announcementId },
            data: updateData,
        });

        return NextResponse.json(updatedAnnouncement);
    } catch (error) {
        console.error('Error updating announcement:', error);
        return NextResponse.json({ error: 'Duyuru güncellenemedi' }, { status: 500 });
    }
}
