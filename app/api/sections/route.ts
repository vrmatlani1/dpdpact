import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { number, title, content, chapterId } = body;

        const section = await prisma.section.create({
            data: {
                number,
                title,
                content,
                chapterId: parseInt(chapterId),
            },
        });

        return NextResponse.json(section);
    } catch (error) {
        console.error('Error creating section:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
