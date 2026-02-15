import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { currentPassword, newPassword } = await request.json();

        // 1. Check authentication
        const cookieStore = await cookies();
        const adminId = cookieStore.get('admin_session')?.value;

        if (!adminId) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });
        }

        // 2. Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Mevcut ve yeni şifre gereklidir.' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır.' }, { status: 400 });
        }

        // 3. Verify current password
        const admin = await prisma.admin.findUnique({ where: { id: adminId } });

        if (!admin) {
            return NextResponse.json({ error: 'Yönetici bulunamadı.' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Mevcut şifre yanlış.' }, { status: 400 });
        }

        // 4. Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.admin.update({
            where: { id: adminId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
