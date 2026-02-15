import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, userId } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        // Upsert token (update if exists, create if not)
        // We use token as unique key. If user logs in with same device but different user, update userId.
        const deviceToken = await prisma.deviceToken.upsert({
            where: { token },
            update: { userId },
            create: {
                token,
                userId
            }
        });

        return NextResponse.json(deviceToken, { status: 200 });
    } catch (error) {
        console.error('Error registering device token:', error);
        return NextResponse.json({ error: 'Failed to register token' }, { status: 500 });
    }
}
