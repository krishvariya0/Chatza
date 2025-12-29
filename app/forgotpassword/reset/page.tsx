"use client";

import { showToast } from "@/lib/toast";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm, useWatch } from "react-hook-form";

type ResetPasswordForm = {
    password: string;
    confirmPassword: string;
};

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordForm>();

    const password = useWatch({ control, name: "password" });

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            showToast.error("Invalid or expired reset link");
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                showToast.error(result.message || "Reset failed");
                return;
            }

            showToast.success("Password updated successfully. Please login.");
            router.push("/auth/login");
        } catch {
            showToast.error("Something went wrong");
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
        <div className="w-full max-w-md rounded-2xl border border-(--border-color) bg-(--card-bg) p-6 shadow-sm sm:p-8 m-2 ">
            {/* // <div className="w-full max-w-[450px] rounded-2xl border border-(--border-color) bg-(--card-bg) p-6 shadow-sm sm:p-8 m-2 " > */}
            {/* Header */}
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold text-(--text-primary)">
                    Reset Password
                </h1>
                <p className="mt-2 text-sm text-(--text-muted)">
                    Enter a new password for your account.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* New Password */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-soft)" />
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                            placeholder="••••••••"
                            className="w-full rounded-lg border bg-transparent py-2.5 pl-10 pr-3 text-sm focus:ring-2"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-soft)" />
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                            placeholder="••••••••"
                            className="w-full rounded-lg border bg-transparent py-2.5 pl-10 pr-3 text-sm focus:ring-2"
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-(--btn-bg) py-2.5 text-white disabled:opacity-60"
                >
                    {isSubmitting ? "Updating..." : "Update Password"}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm">
                Remembere password?{" "}
                <Link
                    href="/auth/login"
                    className="text-(--btn-bg) hover:underline"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-(--text-muted)">Loading...</div>
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
