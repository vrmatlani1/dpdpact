'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchDialog from './SearchDialog';

export default function SearchBar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-full bg-surface shadow-sm border border-outline-variant hover:border-primary hover:shadow-md transition-all text-left group"
            >
                <Search className="text-on-surface-variant group-hover:text-primary transition-colors" size={24} />
                <span className="text-lg text-on-surface-variant/70 group-hover:text-on-surface-variant transition-colors">
                    Ask a question or search for a section...
                </span>
            </button>

            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
