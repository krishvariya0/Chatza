"use client";

import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { useUser } from "@/contexts/UserContext";
import { showToast } from "@/lib/toast";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormData = {
    identifier: string; // email OR username
    password: string;
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: userLoading } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    // Redirect if already logged in
    useEffect(() => {
        if (!userLoading && user) {
            router.push("/home");
        }
    }, [user, userLoading, router]);

    // Show loading while checking auth status
    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-(--bg-primary)">
                <div className="text-(--text-muted)">Loading...</div>
            </div>
        );
    }

    // Don't render login form if user is logged in
    if (user) {
        return null;
    }

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                showToast.error(result.message);
                return;
            }

            showToast.success("Welcome back 🎉");

            // Check for redirect parameter from middleware
            const urlParams = new URLSearchParams(window.location.search);
            const redirectTo = urlParams.get('redirect') || '/home';

            // Full page reload to ensure fresh user data
            window.location.replace(redirectTo);
        } catch {
            showToast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const onError = () => {
        showToast.error("Please fix the highlighted errors");
    };

    return (
        <div className="w-full max-w-112.5 pt-2">
            <div className="rounded-3xl bg-(--card-bg) border border-(--border-color) shadow-xl px-8 py-5">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <ThemeLogo className="w-32 h-20" />
                    <h1 className="text-2xl font-bold text-(--text-primary)">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-(--text-muted) text-center">
                        Sign in to continue to Chatza.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">

                    {/* Email or Username */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-(--text-muted) ml-1">
                            Email or Username
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)"
                                size={18}
                            />
                            <input
                                {...register("identifier", {
                                    required: "Email or username is required",
                                    minLength: {
                                        value: 3,
                                        message: "Must be at least 3 characters",
                                    },
                                })}
                                placeholder="email or username"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border text-sm text-(--text-primary)
                ${errors.identifier ? "border-red-500" : "border-(--border-color)"}`}
                            />
                        </div>
                        {errors.identifier && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.identifier.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-(--text-muted) ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)"
                                size={18}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                placeholder="••••••••"
                                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-transparent border text-sm text-(--text-primary)
                ${errors.password ? "border-red-500" : "border-(--border-color)"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-(--btn-bg) text-white font-semibold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2"
                    >
                        {loading ? "Signing in..." : "Login"}
                        <ArrowRight size={18} />
                    </button>
                </form>
                <div className="flex justify-end">
                    <Link
                        href="/forgotpassword/forgotconfirm"
                        className="text-xs font-medium text-(--text-muted) hover:underline hover:text-(--text-primary)"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-(--border-color) text-center">
                    <p className="text-sm text-(--text-muted)">
                        Don’t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="font-semibold text-(--btn-bg) hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
