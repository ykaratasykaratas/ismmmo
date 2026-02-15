import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        let whereClause: any = {};

        if (status) {
            whereClause.status = status;
        }

        if (search) {
            whereClause.OR = [
                { fullName: { contains: search } }, // SQLite contains is case-sensitive usually but OK for simple search
                { phone: { contains: search } },
                { email: { contains: search } },
                { roomNumber: { contains: search } }
            ];
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
                roomNumber: true,
                status: true,
                createdAt: true,
                categoryId: true,
                // Exclude password
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Üyeler getirilemedi.' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { userId, status, categoryId } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                status,
                categoryId
            }
        });

        const { password: _, ...userInfo } = updatedUser;
        return NextResponse.json(userInfo);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Üye güncellenemedi.' }, { status: 500 });
    }
}
