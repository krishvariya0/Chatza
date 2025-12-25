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

    // Show default logo during SSR/hydration to prevent mismatch
    const logoSrc = theme === 'dark' ? chatzaDarkLogo : chatzaLightLogo;

    return (
        <Image
            src={logoSrc}
            alt="Chatza logo"
            className={className}
            width={120}
            height={80}
        />
    );
}
