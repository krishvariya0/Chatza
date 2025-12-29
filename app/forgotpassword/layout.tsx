import { ThemeLogo } from "@/components/layout/ThemeLogo";
import Link from "next/link";

export default function ForgotPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-(--bg-primary) flex flex-col items-center">

            {/* Logo */}
            <header className="mt-6 mb-4">
                <Link href="/" aria-label="Go to home">
                    <ThemeLogo />
                </Link>
            </header>

            {/* Modal */}
            <section className="w-full flex justify-center">
                {children}
            </section>

            {/* Footer */}
            <footer className="mt-4 mb-6 text-center text-sm text-(--text-muted)">
                <Link className="hover:underline" href="/leagle/privacy-policy">
                    Privacy
                </Link>
                {" · "}
                <Link className="hover:underline" href="/leagle/terms">
                    Terms
                </Link>
                {" · "}
                <Link className="hover:underline" href="/leagle/help">
                    Help
                </Link>
            </footer>

        </main>
    );
}
