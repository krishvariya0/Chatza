import HomeBackButton from "@/components/layout/HomeBackButton";

export default function TermsOfServicePage() {
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
                            📄
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                                Terms of Service
                            </h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Last updated: December 25, 2025
                            </p>
                        </div>
                    </header>

                    {/* Intro */}
                    <p className="mb-8 text-sm leading-relaxed text-[var(--text-muted)]">
                        These Terms of Service govern your access to and use of Chatza.
                        By accessing or using our platform, you agree to be bound by these
                        terms. If you do not agree, please do not use Chatza.
                    </p>

                    {/* Sections */}
                    <TermsSection number="1" title="Acceptance of Terms">
                        By creating an account or using Chatza, you confirm that you have
                        read, understood, and agree to these Terms of Service and our
                        Privacy Policy.
                    </TermsSection>

                    <TermsSection number="2" title="Eligibility">
                        You must be at least 13 years old to use Chatza. By using the
                        platform, you represent that you meet the eligibility requirements
                        and have the legal capacity to enter into this agreement.
                    </TermsSection>

                    <TermsSection number="3" title="User Accounts">
                        You are responsible for maintaining the confidentiality of your
                        account credentials and for all activities that occur under your
                        account. You agree to provide accurate and complete information.
                    </TermsSection>

                    <TermsSection number="4" title="User Conduct">
                        You agree not to misuse Chatza. This includes, but is not limited to,
                        harassment, hate speech, impersonation, posting illegal content, or
                        attempting to compromise platform security.
                    </TermsSection>

                    <TermsSection number="5" title="Content Ownership">
                        You retain ownership of the content you post. By posting content on
                        Chatza, you grant us a non-exclusive license to display and distribute
                        your content as part of the service.
                    </TermsSection>

                    <TermsSection number="6" title="Termination">
                        We reserve the right to suspend or terminate your account at any time
                        if you violate these terms or engage in harmful behavior.
                    </TermsSection>

                    <TermsSection number="7" title="Limitation of Liability">
                        Chatza is provided “as is.” We are not liable for any indirect,
                        incidental, or consequential damages resulting from your use of the
                        platform.
                    </TermsSection>

                    <TermsSection number="8" title="Changes to Terms">
                        We may update these Terms of Service from time to time. Continued
                        use of Chatza after changes means you accept the updated terms.
                    </TermsSection>

                    {/* Footer */}
                    <p className="mt-10 text-xs text-[var(--text-soft)]">
                        If you have any questions about these Terms, please contact us at{" "}
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

function TermsSection({
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
