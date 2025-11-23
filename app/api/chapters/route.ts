import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const chapters = await prisma.chapter.findMany({
            include: {
                sections: true,
            },
            orderBy: {
                number: 'asc',
            },
        });
        return NextResponse.json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { number, title, description } = body;

        const chapter = await prisma.chapter.create({
            data: {
                number,
                title,
                description,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.error('Error creating chapter:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
