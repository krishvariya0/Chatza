"use client";

import { showToast } from "@/lib/toast";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotConfirmPage() {
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier) {
            alert("Please enter email or username");
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

            if (!data.success) {
                showToast.error(data.message);
            } else {
                showToast.success(data.message);
                setIdentifier("");
            }
        } catch {
            showToast.error("Something went wrong");
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
                <p className="mt-2 text-sm leading-relaxed text-(--text-muted)">
                    Enter your email or username. If an account exists, we’ll send a
                    password reset link to the registered email address.
                </p>
            </div>

            {/* Form */}
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
        </div>
    );
}
