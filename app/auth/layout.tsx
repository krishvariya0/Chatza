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
                    <a href="/terms" className="hover:underline">
                        Terms
                    </a>
                    {" · "}
                    <a href="/privacy" className="hover:underline">
                        Privacy
                    </a>
                    {" · "}
                    <a href="/help" className="hover:underline">
                        Help
                    </a>
                </div>
            </div>
        </main>
    );
}
