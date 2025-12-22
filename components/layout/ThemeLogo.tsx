'use client';

import chatzaLightLogo from "@/assets/icons/chatza.png";
import chatzaDarkLogo from "@/assets/icons/dark-thema.png";
import { useTheme } from '../ThemeProvider';

interface ThemeLogoProps {
    className?: string;
}

export function ThemeLogo({ className }: ThemeLogoProps) {
    const { theme } = useTheme();

    return (
        <img
            src={theme === 'light' ? chatzaLightLogo.src : chatzaDarkLogo.src}
            alt="Chatza logo"
            className={className}
        />
    );
}
