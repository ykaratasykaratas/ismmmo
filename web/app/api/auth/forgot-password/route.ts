import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/mail';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'E-posta adresi gereklidir.' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: { email },
        });

        if (!user) {
            // Security: Don't reveal if user exists
            return NextResponse.json(
                { message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama talimatları gönderilmiştir.' },
                { status: 200 }
            );
        }

        // Generate a 6-digit code
        const resetToken = crypto.randomInt(100000, 999999).toString();
        // Token valid for 1 hour
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        await sendEmail({
            to: email,
            subject: 'Şifre Sıfırlama Talebi',
            text: `Şifre sıfırlama kodunuz: ${resetToken}. Bu kod 1 saat geçerlidir.`,
            html: `<p>Şifre sıfırlama kodunuz: <strong>${resetToken}</strong></p><p>Bu kod 1 saat geçerlidir.</p>`,
        });

        return NextResponse.json(
            { message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama talimatları gönderilmiştir.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu.' },
            { status: 500 }
        );
    }
}
