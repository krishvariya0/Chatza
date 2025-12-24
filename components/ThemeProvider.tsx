'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    // 🔹 Init theme (runs once)
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;

        const systemPrefersDark =
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme: Theme =
            stored ?? (systemPrefersDark ? 'dark' : 'light');

        setTheme(initialTheme);
    }, []);

    // 🔹 Apply theme (ONLY place where DOM is touched)
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
