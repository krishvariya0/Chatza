import HomeBackButton from "@/components/layout/HomeBackButton";

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:py-10">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm sm:p-8">

                    {/* Back Button */}
                    <div className="mb-6">
                        <HomeBackButton />
                    </div>

                    {/* Header */}
                    <header className="mb-6 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            🍪
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                                Cookie Policy
                            </h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Last updated: December 25, 2025
                            </p>
                        </div>
                    </header>

                    {/* Intro */}
                    <p className="mb-8 text-sm leading-relaxed text-[var(--text-muted)]">
                        This Cookie Policy explains how Chatza uses cookies and similar
                        technologies to recognize you when you visit our platform. It
                        explains what these technologies are, why we use them, and your
                        rights to control their use.
                    </p>

                    {/* Sections */}
                    <CookieSection number="1" title="What Are Cookies?">
                        Cookies are small text files that are stored on your device when you
                        visit a website. They help websites function properly, improve
                        performance, and provide a better user experience.
                    </CookieSection>

                    <CookieSection number="2" title="How We Use Cookies">
                        We use cookies to keep you logged in, remember your preferences,
                        understand how you use Chatza, improve platform performance, and
                        enhance security.
                    </CookieSection>

                    <CookieSection number="3" title="Types of Cookies We Use">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>
                                <strong className="text-[var(--text-primary)]">
                                    Essential Cookies:
                                </strong>{" "}
                                Required for core platform functionality such as authentication
                                and security.
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">
                                    Performance Cookies:
                                </strong>{" "}
                                Help us analyze usage and improve user experience.
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">
                                    Functional Cookies:
                                </strong>{" "}
                                Remember your preferences like theme and language.
                            </li>
                        </ul>
                    </CookieSection>

                    <CookieSection number="4" title="Third-Party Cookies">
                        Some cookies may be set by trusted third-party services such as
                        analytics or infrastructure providers. These cookies are subject to
                        the respective third parties’ privacy policies.
                    </CookieSection>

                    <CookieSection number="5" title="Managing Cookies">
                        You can control or delete cookies through your browser settings.
                        Please note that disabling cookies may affect the functionality of
                        certain features on Chatza.
                    </CookieSection>

                    <CookieSection number="6" title="Changes to This Policy">
                        We may update this Cookie Policy from time to time to reflect changes
                        in technology or legal requirements. Any updates will be posted on
                        this page.
                    </CookieSection>

                    {/* Footer */}
                    <p className="mt-10 text-xs text-[var(--text-soft)]">
                        If you have questions about our use of cookies, contact us at{" "}
                        <a
                            href="mailto:support@chatza.com"
                            className="font-medium text-red-500 hover:underline"
                        >
                            support@chatza.com
                        </a>.
                    </p>
                </div>
            </div>
        </main>
    );
}

/* ---------------- Section Component ---------------- */

function CookieSection({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-5 rounded-xl border border-[var(--border-color)] bg-[var(--section-bg)]">
            <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {number}
                </div>
                <h2 className="text-sm font-medium text-[var(--text-primary)]">
                    {title}
                </h2>
            </div>
            <div className="px-4 py-4 text-sm text-[var(--text-muted)] leading-relaxed">
                {children}
            </div>
        </section>
    );
}
