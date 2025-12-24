'use client';

import chatzaLightLogo from "@/assets/icons/chatza.png";
import chatzaDarkLogo from "@/assets/icons/dark-thema.png";
import Image from "next/image";
import { useTheme } from '../ThemeProvider';

interface ThemeLogoProps {
    className?: string;
}

export function ThemeLogo({ className }: ThemeLogoProps) {
    const { theme } = useTheme();

    return (
        <Image
            src={theme === 'dark' ? chatzaDarkLogo : chatzaLightLogo}
            alt="Chatza logo"
            className={className}
        />
    );
}
