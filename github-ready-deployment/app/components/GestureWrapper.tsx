'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GestureWrapperProps {
    children: React.ReactNode;
    prevLink?: string;
    nextLink?: string;
}

export default function GestureWrapper({ children, prevLink, nextLink }: GestureWrapperProps) {
    const router = useRouter();
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && nextLink) {
            router.push(nextLink);
        }

        if (isRightSwipe && prevLink) {
            router.push(prevLink);
        }
    };

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="min-h-screen"
        >
            {children}
        </div>
    );
}
