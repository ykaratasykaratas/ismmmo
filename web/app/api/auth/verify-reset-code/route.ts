import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'E-posta ve kod gereklidir.' },
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

        return NextResponse.json(
            { message: 'Kod doğrulandı.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify code error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu.' },
            { status: 500 }
        );
    }
}
