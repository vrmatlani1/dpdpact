'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    sections: Array<{
        id: number;
        number: string;
        title: string;
        content: string;
        chapter: {
            number: number;
            title: string;
        };
    }>;
    aiAnswer: string | null;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults(null);

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (url: string) => {
        router.push(url);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header / Search Input */}
                <div className="p-4 border-b border-outline-variant flex items-center gap-3 bg-surface">
                    <Search className="text-on-surface-variant" size={20} />
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search the DPDP Act..."
                            className="w-full bg-transparent border-none outline-none text-lg text-on-surface placeholder:text-on-surface-variant/50"
                        />
                    </form>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Results Area */}
                <div className="overflow-y-auto p-4 space-y-6 bg-surface-container-low">

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <p>Searching and generating answer...</p>
                        </div>
                    )}

                    {!loading && results && (
                        <>
                            {/* AI Answer */}
                            {results.aiAnswer && (
                                <div className="bg-primary-container/30 rounded-xl p-5 border border-primary/10">
                                    <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
                                        <Sparkles size={18} />
                                        <span>AI Summary</span>
                                    </div>
                                    <div className="prose prose-sm max-w-none text-on-surface">
                                        <p>{results.aiAnswer}</p>
                                    </div>
                                    <div className="mt-3 text-xs text-on-surface-variant flex items-center gap-1">
                                        Powered by Gemini <span className="text-[10px] border border-outline-variant px-1 rounded">Beta</span>
                                    </div>
                                </div>
                            )}

                            {/* Section Results */}
                            {results.sections.length > 0 ? (
                                <div>
                                    <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-3 px-1">
                                        Relevant Sections
                                    </h3>
                                    <div className="space-y-2">
                                        {results.sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => handleNavigate(`/chapter/${section.chapter.number}/section/${section.number}`)}
                                                className="w-full text-left p-4 bg-surface rounded-xl border border-outline-variant/50 hover:border-primary/50 hover:shadow-sm transition-all group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <BookOpen size={18} className="mt-1 text-secondary group-hover:text-primary transition-colors" />
                                                    <div>
                                                        <div className="flex items-baseline gap-2 mb-1">
                                                            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                                Sec {section.number}
                                                            </span>
                                                            <span className="text-xs text-on-surface-variant">
                                                                Chapter {section.chapter.number}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-medium text-on-surface group-hover:text-primary transition-colors">
                                                            {section.title}
                                                        </h4>
                                                        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
                                                            {section.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                !loading && results && !results.aiAnswer && (
                                    <div className="text-center py-12 text-on-surface-variant">
                                        <p>No results found for "{query}"</p>
                                    </div>
                                )
                            )}
                        </>
                    )}

                    {!loading && !results && (
                        <div className="text-center py-12 text-on-surface-variant/50">
                            <Search size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Type to search across all chapters and sections</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
