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
  
  export default config;
  