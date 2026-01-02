/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
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
        brand: "var(--brand)",
        primary: {
          bg: "var(--bg-primary)",
          card: "var(--bg-card)",
          text: "var(--text-primary)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
          soft: "var(--text-soft)",
        },
        border: {
          DEFAULT: "var(--border-color)",
        },
        success: {
          DEFAULT: "var(--success)",
          dark: "var(--success-dark)",
          bg: "var(--success-bg)",
        },
        error: {
          DEFAULT: "var(--error)",
          dark: "var(--error-dark)",
          bg: "var(--error-bg)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          dark: "var(--warning-dark)",
          bg: "var(--warning-bg)",
        },
        info: {
          DEFAULT: "var(--info)",
          dark: "var(--info-dark)",
          bg: "var(--info-bg)",
        },
        accent: {
          red: "var(--accent-red)",
          "red-hover": "var(--accent-red-hover)",
          pink: "var(--accent-pink)",
          blue: "var(--accent-blue)",
          "blue-light": "var(--accent-blue-light)",
          "blue-dark": "var(--accent-blue-dark)",
        },
        hover: {
          bg: "var(--hover-bg)",
          red: "var(--hover-red)",
        },
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
      backgroundImage: {
        'gradient-pink-red': "var(--gradient-pink-red)",
      },
    },
  },
  plugins: [],
};

export default config;
