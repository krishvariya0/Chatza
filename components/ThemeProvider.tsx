'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    mounted: boolean; // ✅ ADD THIS
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {

    // ✅ Mounted flag (CRITICAL for hydration)
    const [mounted, setMounted] = useState(false);

    // ✅ Lazy initialization (NO setState in useEffect)
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'light';

        const stored = localStorage.getItem('theme') as Theme | null;
        const systemPrefersDark =
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        return stored ?? (systemPrefersDark ? 'dark' : 'light');
    });

    // ✅ Mark mounted AFTER hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // ✅ Apply theme only after mounted
    useEffect(() => {
        if (!mounted) return;

        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
