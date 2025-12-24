'use client';

import chatzaLightLogo from "@/assets/icons/chatza.png";
import chatzaDarkLogo from "@/assets/icons/dark-thema.png";
import { useTheme } from '../ThemeProvider';

interface ThemeLogoProps {
    className?: string;
}

export function ThemeLogo({ className }: ThemeLogoProps) {
    const { theme, mounted } = useTheme();

    // 🚫 Prevent hydration mismatch
    if (!mounted) {
        return (
            <img
                src={chatzaLightLogo.src} // SAME on server + first client render
                alt="Chatza logo"
                className={className}
            />
        );
    }

    return (
        <img
            src={theme === 'dark' ? chatzaDarkLogo.src : chatzaLightLogo.src}
            alt="Chatza logo"
            className={className}
        />
    );
}
