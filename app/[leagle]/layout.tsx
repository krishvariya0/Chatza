import { ThemeLogo } from "@/components/layout/ThemeLogo";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">

            {/* Top Bar / Centered Logo */}
            <header className="flex justify-center">
                <ThemeLogo />
            </header>

            {/* Page Content */}
            <div className="mx-auto max-w-5xl ">
                {children}
            </div>
        </div>
    );
}
