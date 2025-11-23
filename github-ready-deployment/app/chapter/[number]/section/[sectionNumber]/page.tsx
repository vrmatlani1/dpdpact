import { prisma } from "@/lib/prisma";
import { Section } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import GestureWrapper from "@/app/components/GestureWrapper";

interface PageProps {
    params: Promise<{
        number: string;
        sectionNumber: string;
    }>;
}

export default async function SectionPage({ params }: PageProps) {
    const { number, sectionNumber } = await params;
    const chapterNumber = parseInt(number);

    const chapter = await prisma.chapter.findUnique({
        where: { number: chapterNumber },
        include: {
            sections: {
                orderBy: { id: 'asc' },
            },
        },
    });

    if (!chapter) {
        notFound();
    }

    const section = chapter.sections.find((s: Section) => s.number === sectionNumber);

    if (!section) {
        notFound();
    }

    // Find previous and next sections
    const currentIndex = chapter.sections.findIndex((s: Section) => s.number === sectionNumber);
    const prevSection = chapter.sections[currentIndex - 1];
    const nextSection = chapter.sections[currentIndex + 1];

    // If no next section in current chapter, try to find first section of next chapter
    let nextChapterLink = null;
    if (!nextSection) {
        const nextChapter = await prisma.chapter.findUnique({
            where: { number: chapterNumber + 1 },
            include: { sections: { orderBy: { id: 'asc' }, take: 1 } },
        });
        if (nextChapter && nextChapter.sections.length > 0) {
            nextChapterLink = {
                href: `/chapter/${nextChapter.number}/section/${nextChapter.sections[0].number}`,
                label: `Chapter ${nextChapter.number}: ${nextChapter.sections[0].title}`,
            };
        }
    }

    // If no prev section in current chapter, try to find last section of prev chapter
    let prevChapterLink = null;
    if (!prevSection) {
        const prevChapter = await prisma.chapter.findUnique({
            where: { number: chapterNumber - 1 },
            include: { sections: { orderBy: { id: 'desc' }, take: 1 } },
        });
        if (prevChapter && prevChapter.sections.length > 0) {
            prevChapterLink = {
                href: `/chapter/${prevChapter.number}/section/${prevChapter.sections[0].number}`,
                label: `Chapter ${prevChapter.number}: ${prevChapter.sections[0].title}`,
            };
        }
    }

    const prevLink = prevSection
        ? `/chapter/${chapter.number}/section/${prevSection.number}`
        : prevChapterLink?.href;

    const nextLink = nextSection
        ? `/chapter/${chapter.number}/section/${nextSection.number}`
        : nextChapterLink?.href;

    return (
        <GestureWrapper prevLink={prevLink} nextLink={nextLink}>
            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link
                        href={`/chapter/${chapter.number}`}
                        className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Chapter {chapter.number}
                    </Link>
                    <h1 className="text-3xl font-bold text-on-surface mb-2">
                        Section {section.number}
                    </h1>
                    <h2 className="text-xl text-primary font-medium mb-6">
                        {section.title}
                    </h2>
                    <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
                </div>

                <div className="bg-surface rounded-2xl p-8 shadow-sm border border-outline-variant/50 mb-12">
                    <div className="prose prose-lg max-w-none text-on-surface font-serif">
                        {section.content.split('\n').map((paragraph: string, index: number) => (
                            paragraph.trim() && (
                                <p key={index} className="mb-6 leading-loose text-justify">
                                    {paragraph.trim()}
                                </p>
                            )
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-outline-variant/50">
                    {/* Previous Navigation */}
                    {prevSection ? (
                        <Link
                            href={`/chapter/${chapter.number}/section/${prevSection.number}`}
                            className="group flex flex-col items-start p-4 rounded-xl hover:bg-surface-variant/50 transition-colors w-full sm:w-1/2"
                        >
                            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1 flex items-center">
                                <ArrowLeft size={12} className="mr-1" /> Previous Section
                            </span>
                            <span className="font-medium text-primary group-hover:underline decoration-2 underline-offset-2">
                                Section {prevSection.number}
                            </span>
                            <span className="text-sm text-on-surface-variant truncate w-full">
                                {prevSection.title}
                            </span>
                        </Link>
                    ) : prevChapterLink ? (
                        <Link
                            href={prevChapterLink.href}
                            className="group flex flex-col items-start p-4 rounded-xl hover:bg-surface-variant/50 transition-colors w-full sm:w-1/2"
                        >
                            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1 flex items-center">
                                <ArrowLeft size={12} className="mr-1" /> Previous Chapter
                            </span>
                            <span className="font-medium text-primary group-hover:underline decoration-2 underline-offset-2">
                                {prevChapterLink.label}
                            </span>
                        </Link>
                    ) : (
                        <div className="w-full sm:w-1/2"></div>
                    )}

                    {/* Next Navigation */}
                    {nextSection ? (
                        <Link
                            href={`/chapter/${chapter.number}/section/${nextSection.number}`}
                            className="group flex flex-col items-end text-right p-4 rounded-xl hover:bg-surface-variant/50 transition-colors w-full sm:w-1/2"
                        >
                            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1 flex items-center">
                                Next Section <ArrowRight size={12} className="ml-1" />
                            </span>
                            <span className="font-medium text-primary group-hover:underline decoration-2 underline-offset-2">
                                Section {nextSection.number}
                            </span>
                            <span className="text-sm text-on-surface-variant truncate w-full">
                                {nextSection.title}
                            </span>
                        </Link>
                    ) : nextChapterLink ? (
                        <Link
                            href={nextChapterLink.href}
                            className="group flex flex-col items-end text-right p-4 rounded-xl hover:bg-surface-variant/50 transition-colors w-full sm:w-1/2"
                        >
                            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1 flex items-center">
                                Next Chapter <ArrowRight size={12} className="ml-1" />
                            </span>
                            <span className="font-medium text-primary group-hover:underline decoration-2 underline-offset-2">
                                {nextChapterLink.label}
                            </span>
                        </Link>
                    ) : (
                        <div className="w-full sm:w-1/2"></div>
                    )}
                </div>
            </div>
        </GestureWrapper>
    );
}
