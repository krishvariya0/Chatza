"use client";

/* =========================
   Imports
========================= */
import { HelpCircle, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";

/* =========================
   MAIN PAGE COMPONENT
========================= */
export default function HelpPage() {
    return (
        <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-16">

            {/* =========================
               PAGE HEADER SECTION
            ========================= */}
            <section className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-semibold text-[var(--text-primary)]">
                    Help Center
                </h1>
                <p className="mt-4 text-[var(--text-muted)]">
                    Find answers to common questions or contact our support team.
                </p>
            </section>

            {/* =========================
               HELP CARDS SECTION
            ========================= */}
            <section className="grid gap-6 max-w-5xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-20">

                <HelpCard
                    icon={<Lock size={22} />}
                    title="Account & Login"
                    desc="Trouble signing in or managing your account."
                />

                <HelpCard
                    icon={<Shield size={22} />}
                    title="Privacy & Security"
                    desc="Learn how your data is protected."
                />

                <HelpCard
                    icon={<HelpCircle size={22} />}
                    title="Password Reset"
                    desc="Reset your password securely."
                />

                <HelpCard
                    icon={<Mail size={22} />}
                    title="Contact Support"
                    desc="Need human help? Contact us."
                />

            </section>

            {/* =========================
               FAQ SECTION
            ========================= */}
            <section className="max-w-3xl mx-auto mb-24">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    <FaqItem
                        q="I forgot my password. What should I do?"
                        a="Click on 'Forgot Password' on the login page to receive a reset link."
                    />
                    <FaqItem
                        q="I didn’t receive the reset email."
                        a="Check your spam folder or wait a few minutes before trying again."
                    />
                    <FaqItem
                        q="How do I delete my account?"
                        a="Account deletion is handled manually. Please contact support."
                    />
                    <FaqItem
                        q="Is my data secure on Chatza?"
                        a="Yes. We follow modern security best practices."
                    />
                </div>
            </section>

            {/* =========================
               CONTACT FORM SECTION
            ========================= */}
            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                    Contact Us
                </h2>
                <p className="text-[var(--text-muted)] mb-8">
                    Send us a message and we’ll get back to you.
                </p>

                <ContactForm />
            </section>

        </main>
    );
}

/* =========================================================
   COMPONENT: HelpCard
   Purpose: Displays each help category card
========================================================= */
function HelpCard({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div
            className="
                rounded-2xl
                border border-[var(--border-color)]
                bg-[var(--card-bg)]
                p-6
                transition
                hover:shadow-md
            "
        >
            {/* Icon (RED via --btn-bg) */}
            <div className="mb-4 text-[var(--btn-bg)]">
                {icon}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[var(--text-muted)]">
                {desc}
            </p>
        </div>
    );
}

/* =========================================================
   COMPONENT: FaqItem
   Purpose: Accordion-style FAQ item
========================================================= */
function FaqItem({ q, a }: { q: string; a: string }) {
    return (
        <details
            className="
                rounded-xl
                border border-[var(--border-color)]
                bg-[var(--card-bg)]
                p-4
            "
        >
            <summary
                className="
                    cursor-pointer
                    font-medium
                    text-[var(--text-primary)]
                    marker:text-[var(--btn-bg)]
                "
            >
                {q}
            </summary>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
                {a}
            </p>
        </details>
    );
}

/* =========================================================
   COMPONENT: ContactForm
   Purpose: Sends message to backend (/api/contact)
========================================================= */
function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        const formData = new FormData(e.currentTarget);

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message"),
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.message || "Something went wrong");
            return;
        }

        setSuccess("Message sent successfully!");
        e.currentTarget.reset();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
                space-y-5
                rounded-2xl
                border border-[var(--border-color)]
                bg-[var(--card-bg)]
                p-6
            "
        >
            {/* Name Field */}
            <div>
                <label className="block text-sm mb-1 text-[var(--text-primary)]">
                    Your Name
                </label>
                <input
                    name="name"
                    required
                    className="
                        w-full
                        rounded-xl
                        border border-[var(--border-color)]
                        bg-transparent
                        px-4 py-2
                        text-[var(--text-primary)]
                        outline-none
                        focus:border-[var(--btn-bg)]
                    "
                />
            </div>

            {/* Email Field */}
            <div>
                <label className="block text-sm mb-1 text-[var(--text-primary)]">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    className="
                        w-full
                        rounded-xl
                        border border-[var(--border-color)]
                        bg-transparent
                        px-4 py-2
                        text-[var(--text-primary)]
                        outline-none
                        focus:border-[var(--btn-bg)]
                    "
                />
            </div>

            {/* Message Field */}
            <div>
                <label className="block text-sm mb-1 text-[var(--text-primary)]">
                    Message
                </label>
                <textarea
                    name="message"
                    rows={4}
                    required
                    className="
                        w-full
                        rounded-xl
                        border border-[var(--border-color)]
                        bg-transparent
                        px-4 py-2
                        text-[var(--text-primary)]
                        outline-none
                        focus:border-[var(--btn-bg)]
                    "
                />
            </div>

            {/* Status Messages */}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            {/* Submit Button */}
            <button
                disabled={loading}
                className="
                    rounded-xl
                    bg-[var(--btn-bg)]
                    px-6 py-3
                    text-white
                    font-medium
                    hover:opacity-90
                    disabled:opacity-60
                "
            >
                {loading ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
