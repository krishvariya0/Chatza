import Link from "next/link";
import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main
            className=" bg-[var(--bg-primary)]  min-h-screen flex items-center justify-center px-4"
        >
            <div className="w-full flex flex-col items-center">
                {children}

                {/* Bottom Links */}
                <div className="mt-2 mb-2  text-center text-sm text-[var(--text-muted)]">
                    <Link className="hover:underline" href=" /leagle/privacy-policy">Privacy</Link>
                    {" · "}
                    <Link className="hover:underline" href="/leagle/terms">Terms</Link>
                    {" · "}
                    <a href="/help" className="hover:underline">
                        Help
                    </a>
                    {" . "}
                </div>
            </div>
        </main >
    );
}