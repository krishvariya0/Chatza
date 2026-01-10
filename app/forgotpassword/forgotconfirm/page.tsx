"use client";

import { showToast } from "@/lib/toast";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotConfirmPage() {
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier) {
            showToast.error("Please enter email or username");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast.error(data.message || "Failed to send reset link");
                return;
            }

            // Success - Show success state
            showToast.success("✉️ Password reset email sent successfully!");
            setEmailSent(true);
        } catch (error) {
            console.error("Forgot password error:", error);
            showToast.error("Unable to send reset email. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="
            w-full
            max-w-md
            rounded-2xl
            border border-(--border-color)
            bg-(--card-bg)
            shadow-sm
            p-5 sm:p-8
            m-2
        ">
            {/* Header */}
            <div className="mb-6 text-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-(--text-primary)">
                    Forgot Password
                </h1>
                {!emailSent && (
                    <p className="mt-2 text-sm leading-relaxed text-(--text-muted)">
                        Enter your email or username. If an account exists, we&apos;ll send a
                        password reset link to the registered email address.
                    </p>
                )}
            </div>

            {emailSent ? (
                /* Success Message */
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="mb-4 rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-(--text-primary) mb-2 text-center">
                            Email Sent Successfully!
                        </h2>
                        <p className="text-sm text-(--text-muted) text-center leading-relaxed max-w-sm">
                            We sent a password reset link to your email. Please check your inbox
                            and follow the instructions to reset your password.
                        </p>
                    </div>

                    <div className="border-t border-(--border-color) pt-6">
                        <p className="text-xs text-(--text-muted) text-center mb-4">
                            Didn&apos;t receive the email? Check your spam folder or try again.
                        </p>
                        <button
                            onClick={() => {
                                setEmailSent(false);
                                setIdentifier("");
                            }}
                            className="
                                w-full
                                rounded-lg
                                py-2.5
                                text-sm font-medium
                                border-2 border-(--btn-bg)
                                text-(--btn-bg)
                                transition hover:bg-(--btn-bg) hover:text-white
                                focus:outline-none focus:ring-2 focus:ring-(--btn-bg)/40
                            "
                        >
                            Send Again
                        </button>
                    </div>

                    {/* Back to Login Link */}
                    <div className="text-center text-sm text-(--text-muted)">
                        <Link
                            href="/auth/login"
                            className="font-medium text-(--btn-bg) hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            ) : (
                /* Form */
                <>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Identifier Input */}
                        <div>
                            <label
                                htmlFor="identifier"
                                className="mb-1 block text-sm font-medium text-(--text-primary)"
                            >
                                Email or Username
                            </label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-soft)" />
                                <input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="Enter email or username"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-(--border-color)
                                        bg-transparent
                                        py-3 sm:py-2.5
                                        pl-10 pr-3
                                        text-sm
                                        text-(--text-primary)
                                        placeholder:text-(--text-soft)
                                        focus:border-(--btn-bg)
                                        focus:outline-none
                                        focus:ring-2 focus:ring-(--btn-bg)/20
                                    "
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                py-3 sm:py-2.5
                                text-sm font-medium
                                bg-(--btn-bg)
                                text-white
                                transition hover:opacity-90
                                focus:outline-none focus:ring-2 focus:ring-(--btn-bg)/40
                                disabled:opacity-60
                            "
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm text-(--text-muted)">
                        Remember your password?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-(--btn-bg) hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
