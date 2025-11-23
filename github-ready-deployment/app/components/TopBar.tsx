'use client';

import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import SearchDialog from './SearchDialog';

export default function TopBar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/50 px-6 py-3 flex items-center justify-between md:justify-end">
                {/* Mobile Menu Trigger (Placeholder - Sidebar handles its own trigger usually, but good to have space) */}
                <div className="md:hidden">
                    {/* Sidebar trigger is currently inside Sidebar component, 
                so we might just leave this empty or coordinate state later if needed. 
                For now, we focus on the Search trigger. */}
                </div>

                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-primary border border-transparent hover:border-outline-variant"
                >
                    <Search size={18} />
                    <span className="text-sm font-medium hidden sm:inline">Search Act...</span>
                </button>
            </header>

            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
