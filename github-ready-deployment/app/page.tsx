import SearchBar from "./components/SearchBar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Chapter, Section } from "@prisma/client";

export default async function Home() {
  // Fetch chapters with sections
  const chapters = await prisma.chapter.findMany({
    include: { sections: true },
    orderBy: { number: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-on-background mb-4">
          Digital Personal Data Protection Act, 2023
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          An Act to provide for the processing of digital personal data in a manner that recognises both the right of individuals to protect their personal data and the need to process such personal data for lawful purposes and for matters connected therewith or incidental thereto.
        </p>

        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </header>

      <div className="space-y-8">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-shadow">
            <Link href={`/chapter/${chapter.number}`} className="group">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-2xl font-semibold text-primary group-hover:underline decoration-2 underline-offset-4">
                  Chapter {chapter.number}: {chapter.title}
                </h2>
                <span className="text-sm font-medium text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">
                  {chapter.sections.length} Sections
                </span>
              </div>
              {chapter.description && (
                <p className="text-on-surface-variant mb-6">{chapter.description}</p>
              )}
            </Link>

            <div className="grid gap-3 md:grid-cols-2">
              {chapter.sections.map((section: Section) => (
                <Link
                  key={section.id}
                  href={`/chapter/${chapter.number}#section-${section.number}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary-container/50 transition-colors group/section"
                >
                  <span className="font-mono text-sm font-bold text-secondary mt-0.5">
                    {section.number}
                  </span>
                  <span className="text-sm text-on-surface group-hover/section:text-on-secondary-container">
                    {section.title}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href={`/chapter/${chapter.number}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-on-primary-container transition-colors"
              >
                Read Chapter <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
