import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch version and url from SystemSettings
        const versionSetting = await prisma.systemSetting.findUnique({ where: { key: 'mobile_app_version' } });
        const urlSetting = await prisma.systemSetting.findUnique({ where: { key: 'mobile_app_url' } });
        const forceUpdateSetting = await prisma.systemSetting.findUnique({ where: { key: 'mobile_force_update' } });

        return NextResponse.json({
            version: versionSetting?.value || '1.0.0',
            url: urlSetting?.value || '',
            forceUpdate: forceUpdateSetting?.value === 'true',
        });
    } catch (error) {
        console.error('Error fetching version:', error);
        return NextResponse.json({ error: 'Sürüm bilgisi alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { version, url, forceUpdate } = body;

        // Upsert settings
        if (version) {
            await prisma.systemSetting.upsert({
                where: { key: 'mobile_app_version' },
                update: { value: version },
                create: { key: 'mobile_app_version', value: version }
            });
        }

        if (url) {
            await prisma.systemSetting.upsert({
                where: { key: 'mobile_app_url' },
                update: { value: url },
                create: { key: 'mobile_app_url', value: url }
            });
        }

        if (forceUpdate !== undefined) {
            await prisma.systemSetting.upsert({
                where: { key: 'mobile_force_update' },
                update: { value: String(forceUpdate) },
                create: { key: 'mobile_force_update', value: String(forceUpdate) }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating version:', error);
        return NextResponse.json({ error: 'Sürüm güncellenemedi.' }, { status: 500 });
    }
}
