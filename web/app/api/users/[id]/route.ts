import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = id;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Delete participations first (cascade delete logic if not set in DB)
        await prisma.participation.deleteMany({
            where: { userId: userId },
        });

        // Delete device tokens
        await prisma.deviceToken.deleteMany({
            where: { userId: userId },
        });

        // Delete user
        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Kullanıcı silinemedi' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = id;
        const body = await req.json();

        // Extract fields that are allowed to be updated
        const { status, fullName, phone, email, roomNumber, photoUrl } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email;
        if (roomNumber) updateData.roomNumber = roomNumber;
        // if (photoUrl) updateData.photoUrl = photoUrl; 

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'Güncellenecek veri yok' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        // Return the updated user (excluding password)
        const { password: _, ...userInfo } = updatedUser;

        return NextResponse.json(userInfo);
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: `Kullanıcı güncellenemedi: ${error.message}` }, { status: 500 });
    }
}
