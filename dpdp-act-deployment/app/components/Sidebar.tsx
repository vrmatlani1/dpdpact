'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Book } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface Chapter {
    id: number;
    number: number;
    title: string;
}

interface SidebarProps {
    chapters: Chapter[];
}

export default function Sidebar({ chapters }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-on-primary shadow-md"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 h-full w-80 bg-surface-variant text-on-surface-variant z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shadow-xl lg:shadow-none overflow-y-auto',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary rounded-xl text-on-primary">
                            <Book size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-on-surface">DPDP Act</h1>
                    </Link>

                    <nav className="space-y-1">
                        <Link
                            href="/"
                            className={clsx(
                                'block px-4 py-3 rounded-full text-sm font-medium transition-colors',
                                pathname === '/'
                                    ? 'bg-secondary-container text-on-secondary-container'
                                    : 'hover:bg-surface-variant/50'
                            )}
                        >
                            Home
                        </Link>

                        <div className="pt-4 pb-2">
                            <h2 className="px-4 text-xs font-semibold uppercase tracking-wider opacity-70">Chapters</h2>
                        </div>

                        {chapters.map((chapter) => (
                            <Link
                                key={chapter.id}
                                href={`/chapter/${chapter.number}`}
                                className={clsx(
                                    'block px-4 py-3 rounded-full text-sm font-medium transition-colors',
                                    pathname === `/chapter/${chapter.number}`
                                        ? 'bg-secondary-container text-on-secondary-container'
                                        : 'hover:bg-surface-variant/50'
                                )}
                            >
                                <span className="font-bold mr-2">Ch {chapter.number}</span>
                                <span className="truncate">{chapter.title}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}
