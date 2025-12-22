/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1.5rem",
                lg: "2rem",
            },
            screens: {
                xl: "1280px",
            },
        },
        extend: {
            colors: {
                /* Brand */
                primary: "#ef4444",
                primarySoft: "#fee2e2",

                /* Backgrounds */
                bgMain: "#faf7f7",
                bgCard: "#ffffff",
                bgSoft: "#f5f5f5",

                /* Text */
                textMain: "#111827",
                textMuted: "#6b7280",
                textSoft: "#9ca3af",

                /* Borders */
                borderLight: "#e5e7eb",

                /* Dark mode variants */
                dark: {
                    bgMain: "#030712",
                    bgCard: "#111827",
                    bgSoft: "#1f2937",
                    textMain: "#f9fafb",
                    textMuted: "#d1d5db",
                    textSoft: "#9ca3af",
                    borderLight: "#374151",
                }
            },

            borderRadius: {
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "20px",
            },

            boxShadow: {
                card: "0 10px 25px -5px rgba(0,0,0,0.08)",
                soft: "0 4px 12px rgba(0,0,0,0.05)",
            },

            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
