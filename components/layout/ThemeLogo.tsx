'use client';

import chatzaLightLogo from "@/assets/icons/chatza.png";
import chatzaDarkLogo from "@/assets/icons/dark-thema.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from '../ThemeProvider';

interface ThemeLogoProps {
    className?: string;
}

export function ThemeLogo({ className }: ThemeLogoProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering theme-specific content after mount
    useEffect(() => {
        // Use a microtask to avoid synchronous setState in effect
        Promise.resolve().then(() => setMounted(true));
    }, []);

    // Show light logo during SSR and initial render to prevent mismatch
    const logoSrc = mounted && theme === 'dark' ? chatzaDarkLogo : chatzaLightLogo;

    return (
        <Image
            src={logoSrc}
            alt="Chatza logo"
            className={className}
            width={120}
            height={80}
            priority
        />
    );
}
