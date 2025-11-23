import { prisma } from "@/lib/prisma";
import { Section } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PageProps {
    params: Promise<{ number: string }>;
}

export default async function ChapterPage({ params }: PageProps) {
    const { number } = await params;
    const chapterNumber = parseInt(number);

    if (isNaN(chapterNumber)) {
        notFound();
    }

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

    // Fetch next/prev chapters for navigation
    const prevChapter = await prisma.chapter.findUnique({
        where: { number: chapterNumber - 1 },
        select: { number: true, title: true },
    });

    const nextChapter = await prisma.chapter.findUnique({
        where: { number: chapterNumber + 1 },
        select: { number: true, title: true },
    });

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Contents
                </Link>
            </div>

            <header className="mb-12">
                <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                    Chapter {chapter.number}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-on-background mb-4">
                    {chapter.title}
                </h1>
                {chapter.description && (
                    <p className="text-lg text-on-surface-variant italic border-l-4 border-primary/20 pl-4">
                        {chapter.description}
                    </p>
                )}
            </header>

            <div className="space-y-12">
                {chapter.sections.map((section: Section) => (
                    <section key={section.id} id={`section-${section.number}`} className="scroll-mt-24">
                        <Link href={`/chapter/${chapter.number}/section/${section.number}`} className="group block hover:bg-surface-variant/30 p-2 -ml-2 rounded-lg transition-colors">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="font-mono text-lg font-bold text-primary group-hover:underline decoration-2 underline-offset-4">
                                    {section.number}
                                </span>
                                <h2 className="text-xl font-semibold text-on-surface group-hover:text-primary transition-colors">
                                    {section.title}
                                </h2>
                            </div>
                        </Link>
                        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-on-surface-variant">
                            <p>{section.content}</p>
                        </div>
                    </section>
                ))}
            </div>

            <hr className="my-12 border-outline-variant" />

            {/* Footer Navigation */}
            <div className="flex justify-between items-center">
                {prevChapter ? (
                    <Link
                        href={`/chapter/${prevChapter.number}`}
                        className="group flex flex-col items-start"
                    >
                        <span className="text-xs font-medium text-secondary mb-1 flex items-center">
                            <ArrowLeft size={12} className="mr-1" /> Previous Chapter
                        </span>
                        <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                            Chapter {prevChapter.number}
                        </span>
                    </Link>
                ) : (
                    <div />
                )}

                {nextChapter && (
                    <Link
                        href={`/chapter/${nextChapter.number}`}
                        className="group flex flex-col items-end text-right"
                    >
                        <span className="text-xs font-medium text-secondary mb-1 flex items-center">
                            Next Chapter <ArrowRight size={12} className="ml-1" />
                        </span>
                        <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                            Chapter {nextChapter.number}
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}
