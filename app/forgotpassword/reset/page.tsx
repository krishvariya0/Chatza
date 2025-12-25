"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            alert("Invalid or expired reset link");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Reset failed");
                return;
            }

            alert("Password updated successfully. Please login.");
            router.push("/auth/login");
        } catch {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Invalid or expired reset link
            </div>
        );
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm sm:p-8">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Reset Password
                </h1>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Enter a new password for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-soft)]" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border bg-transparent py-2.5 pl-10 pr-3 text-sm focus:ring-2"
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-soft)]" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border bg-transparent py-2.5 pl-10 pr-3 text-sm focus:ring-2"
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full rounded-lg bg-[var(--btn-bg)] py-2.5 text-white disabled:opacity-60"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                Remembered your password?{" "}
                <Link href="/auth/login" className="text-[var(--btn-bg)] hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
