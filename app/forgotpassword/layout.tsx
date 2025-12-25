import { ThemeLogo } from "@/components/layout/ThemeLogo";
import Link from "next/link";

export default function ForgotPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col">

            {/* Top Center Logo */}
            <header className="flex justify-center pt-5 pb-4">
                <Link href="/" aria-label="Go to home">
                    <ThemeLogo />
                </Link>
            </header>

            {/* Page Content */}
            <section className="flex flex-1 justify-center items-start pt-6 pb-10">
                {children}
            </section>

        </main>
    );
}
