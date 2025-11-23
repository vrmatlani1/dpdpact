import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Import the seed data
const seedData = async () => {
    // Clear existing data
    await prisma.section.deleteMany();
    await prisma.chapter.deleteMany();

    const chapters = [
        {
            number: 1,
            title: "Preliminary",
            description: "Introduction to the Act",
            sections: [
                {
                    number: "1",
                    title: "Short title and commencement",
                    content:
                        "(1) This Act may be called the Digital Personal Data Protection Act, 2023.\\n(2) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint and different dates may be appointed for different provisions of this Act and any reference in any such provision to the commencement of this Act shall be construed as a reference to the coming into force of that provision.",
                },
                {
                    number: "2",
                    title: "Definitions",
                    content:
                        'In this Act, unless the context otherwise requires,—\\n(a) "Appellate Tribunal" means the Telecom Disputes Settlement and Appellate Tribunal established under section 14 of the Telecom Regulatory Authority of India Act, 1997;\\n(b) "automated" means any digital process capable of operating automatically in response to instructions given or otherwise for the purpose of processing data;\\n...(truncated for brevity - full definitions in actual seed)',
                },
                {
                    number: "3",
                    title: "Application of Act",
                    content:
                        "Subject to the provisions of this Act, it shall—\\n(a) apply to the processing of digital personal data within the territory of India...",
                },
            ],
        },
        // Add all other chapters here
    ];

    for (const chapter of chapters) {
        await prisma.chapter.create({
            data: {
                number: chapter.number,
                title: chapter.title,
                description: chapter.description,
                sections: {
                    create: chapter.sections,
                },
            },
        });
    }

    return { success: true, message: "Database seeded successfully" };
};

export async function GET(request: Request) {
    try {
        // Check if database is already seeded
        const count = await prisma.chapter.count();

        if (count > 0) {
            return NextResponse.json({
                message: "Database already seeded",
                chapters: count,
            });
        }

        // Seed the database
        const result = await seedData();

        return NextResponse.json(result);
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Failed to seed database", details: error },
            { status: 500 }
        );
    }
}
