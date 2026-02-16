import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, code, newPassword } = await req.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json(
                { error: 'Tüm alanlar gereklidir.' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetToken: code,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Geçersiz veya süresi dolmuş kod.' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json(
            { message: 'Şifreniz başarıyla güncellendi.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu.' },
            { status: 500 }
        );
    }
}
