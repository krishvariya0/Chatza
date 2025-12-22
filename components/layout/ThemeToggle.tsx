'use client';

import { BsMoonStars } from 'react-icons/bs';
import { LuSunDim } from 'react-icons/lu';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-300
                 bg-gray-200 dark:bg-gray-700
                 text-gray-800 dark:text-gray-200
                 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <BsMoonStars className="w-5 h-5" />
            ) : (
                <LuSunDim className="w-5 h-5" />
            )}
        </button>
    );
}
