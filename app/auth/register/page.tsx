"use client";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { useUser } from "@/contexts/UserContext";
import { showToast } from "@/lib/toast";
import { ArrowRight, AtSign, Eye, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoReturnDownBack } from "react-icons/io5";


type RegisterFormData = {
    fullName: string;
    username: string;
    email: string;
    password: string;
};

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: userLoading } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

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

    // Don't render register form if user is logged in
    if (user) {
        return null;
    }

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                showToast.error(result.message);
                return;
            }

            showToast.success("Account created successfully 🎉");

            // Redirect to onboarding
            window.location.href = "/onboarding";
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
                <Link href="/"><IoReturnDownBack /></Link>

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <ThemeLogo className="w-32 h-20 " />
                    <h1 className="text-2xl font-bold text-(--text-primary)">
                        Join Chatza
                    </h1>
                    <p className="mt-2 text-sm text-(--text-muted) text-center">
                        Create your account to start sharing today.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="space-y-5"
                >

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-(--text-muted) ml-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)" size={18} />
                            <input
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: { value: 3, message: "Minimum 3 characters" },
                                })}
                                placeholder="John Doe"
                                suppressHydrationWarning
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border text-sm text-(--text-primary)
                ${errors.fullName ? "border-red-500" : "border-(--border-color)"}`}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-(--text-muted) ml-1">
                            Username
                        </label>
                        <div className="relative">
                            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)" size={18} />
                            <input
                                {...register("username", {
                                    required: "Username is required",
                                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers & underscores allowed", },
                                })}
                                placeholder="johndoe"
                                suppressHydrationWarning
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border text-sm text-(--text-primary)
                ${errors.username ? "border-red-500" : "border-(--border-color)"}`}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-(--text-muted) ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)" size={18} />
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address", },
                                })}
                                placeholder="name@example.com"
                                suppressHydrationWarning
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border text-sm text-(--text-primary)
                ${errors.email ? "border-red-500" : "border-(--border-color)"}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-(--text-muted) ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters", },
                                })}
                                placeholder="••••••••"
                                suppressHydrationWarning
                                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-transparent border text-sm text-(--text-primary)
                ${errors.password ? "border-red-500" : "border-(--border-color)"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)"
                                suppressHydrationWarning
                            >
                                <Eye size={18} />
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
                        suppressHydrationWarning
                    >

                        {loading ? "Creating account..." : "Register"}

                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-(--border-color) text-center">
                    <p className="text-sm text-(--text-muted)">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-semibold text-(--btn-bg) hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
