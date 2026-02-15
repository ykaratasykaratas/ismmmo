import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    // Await params if using Next.js 15+ convention, although in many versions it's direct.
    // Let's use it safely.
    const { filename } = await (params as any);

    const filePath = path.join(process.cwd(), 'public/uploads', filename);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('Resim bulunamadı.', { status: 404 });
    }

    try {
        const fileBuffer = fs.readFileSync(filePath);

        // Determine content type based on extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.webp') contentType = 'image/webp';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('Resim okunurken hata oluştu.', { status: 500 });
    }
}
