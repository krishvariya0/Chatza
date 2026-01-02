'use client';

import { useEffect, useState } from 'react';
import { BsMoonStars } from 'react-icons/bs';
import { LuSunDim } from 'react-icons/lu';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering theme-specific content after mount
    useEffect(() => {
        // Use a microtask to avoid synchronous setState in effect
        Promise.resolve().then(() => setMounted(true));
    }, []);

    // Show moon icon during SSR and initial render to prevent mismatch
    const IconComponent = mounted && theme === 'dark' ? LuSunDim : BsMoonStars;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-300
                 bg-(--border-color) text-(--text-primary)
                 hover:bg-(--hover-bg)"
            aria-label="Toggle theme"
        >
            <IconComponent className="w-5 h-5" />
        </button>
    );
}
