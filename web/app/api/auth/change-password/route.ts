import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, oldPassword, newPassword } = body;

        if (!userId || !oldPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Eksik bilgi.' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı.' },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Mevcut şifre hatalı.' },
                { status: 401 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: 'Şifre başarıyla güncellendi.' });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { error: 'Şifre değiştirilemedi.' },
            { status: 500 }
        );
    }
}
