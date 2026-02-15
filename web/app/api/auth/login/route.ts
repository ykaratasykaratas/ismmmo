import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, password } = body;

        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı.' },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Login Attempt:', {
            phone,
            receivedPassword: password,
            storedHash: user.password,
            isMatch: isPasswordValid
        });

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Hatalı şifre.' },
                { status: 401 }
            );
        }

        if (user.status !== 'Approved') {
            // Return user but with pending status warning if needed, 
            // or let the client handle based on user.status
        }

        // Return user info excluding password
        const { password: _, ...userInfo } = user;

        return NextResponse.json(userInfo, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Giriş yapılırken bir hata oluştu.' },
            { status: 500 }
        );
    }
}
