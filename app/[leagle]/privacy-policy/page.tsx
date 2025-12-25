import HomeBackButton from "@/components/layout/HomeBackButton";

export default function PrivacyPolicyPage() {
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
                            🔒
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                                Privacy Policy
                            </h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Last updated: December 25, 2025 · Version 1.0
                            </p>
                        </div>
                    </header>

                    {/* Intro */}
                    <p className="mb-8 text-sm leading-relaxed text-[var(--text-muted)]">
                        At Chatza, we take your privacy seriously. We believe in transparency and want
                        you to understand how we collect, use, and protect your information when you
                        use our services. By using Chatza, you agree to the practices described in
                        this Privacy Policy.
                    </p>

                    {/* Sections */}
                    <PolicySection number="1" title="Information We Collect">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>
                                <strong className="text-[var(--text-primary)]">Account Information:</strong>{" "}
                                Name, email address, username, encrypted password, phone number, and account preferences.
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Profile Data:</strong>{" "}
                                Bio, profile photo, social links, and any other information you choose to display.
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Communications:</strong>{" "}
                                Messages, comments, posts, feedback, and interactions on the platform.
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Technical Information:</strong>{" "}
                                IP address, device type, browser, operating system, and usage logs.
                            </li>
                        </ul>
                    </PolicySection>

                    <PolicySection number="2" title="How We Use Your Information">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>To create, manage, and maintain your Chatza account.</li>
                            <li>To personalize your experience and improve platform features.</li>
                            <li>To send important updates, security alerts, and service notifications.</li>
                            <li>To analyze usage patterns and improve performance.</li>
                            <li>To prevent fraud, misuse, and unauthorized access.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection number="3" title="Data Sharing and Disclosure">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>
                                We do <strong className="text-[var(--text-primary)]">not sell</strong> your personal information.
                            </li>
                            <li>
                                Data may be shared with trusted service providers who support Chatza operations.
                            </li>
                            <li>
                                Information may be disclosed if required by law or legal process.
                            </li>
                            <li>
                                In the event of a merger or acquisition, data may be transferred with safeguards.
                            </li>
                        </ul>
                    </PolicySection>

                    <PolicySection number="4" title="Your Rights and Choices">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>You can access, update, or correct your personal information.</li>
                            <li>You may request deletion of your account and associated data.</li>
                            <li>You can control notification and privacy settings.</li>
                            <li>You may withdraw consent where permitted by applicable laws.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection number="5" title="Security Measures">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>Passwords are securely encrypted using industry standards.</li>
                            <li>All data is transmitted over secure HTTPS connections.</li>
                            <li>Strict access controls protect against unauthorized access.</li>
                            <li>Regular reviews and updates strengthen platform security.</li>
                            <li>
                                While we take strong measures, users should also protect their credentials.
                            </li>
                        </ul>
                    </PolicySection>

                    {/* Footer */}
                    <p className="mt-10 text-xs text-[var(--text-soft)]">
                        If you have any questions about this Privacy Policy, please contact us at{" "}
                        <a
                            href="mailto:privacy@chatza.com"
                            className="font-medium text-red-500 hover:underline"
                        >
                            privacy@chatza.com
                        </a>.
                    </p>
                </div>
            </div>
        </main>
    );
}

/* ---------------- Section Component ---------------- */

function PolicySection({
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
