import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, phone, roomNumber, email, birthDate, categoryId, password } = body;

        // Check if phone already exists
        const existingUser = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Bu telefon numarası ile kayıtlı bir üye zaten var.' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with Pending status
        const user = await prisma.user.create({
            data: {
                fullName,
                phone,
                roomNumber,
                email,
                birthDate: new Date(birthDate),
                status: 'Pending',
                categoryId, // Optional
                password: hashedPassword,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Kayıt oluşturulurken bir hata oluştu.' },
            { status: 500 }
        );
    }
}
