import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Kullanıcı adı ve şifre zorunludur.' },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'Geçersiz kullanıcı adı veya şifre.' },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Geçersiz kullanıcı adı veya şifre.' },
                { status: 401 }
            );
        }

        // Set secure cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', admin.id, {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu.' },
            { status: 500 }
        );
    }
}
