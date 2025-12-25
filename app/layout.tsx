import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chatza.com"), // change when deployed

  title: {
    default: "Chatza",
    template: "%s · Chatza",
  },

  description:
    "Chatza is a modern social platform built for authentic connections, meaningful conversations, and a secure digital experience.",

  applicationName: "Chatza",

  keywords: [
    "Chatza",
    "social media",
    "chat application",
    "modern social platform",
    "secure chat",
    "Next.js app",
  ],

  authors: [{ name: "Chatza Team" }],

  creator: "Chatza",
  publisher: "Chatza",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chatza.com",
    siteName: "Chatza",
    title: "Chatza – Modern Social Platform",
    description:
      "Connect authentically with people through Chatza — a modern, secure, and beautifully designed social platform.",
    images: [
      {
        url: "/og-image.png", // add later
        width: 1200,
        height: 630,
        alt: "Chatza – Social Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Chatza – Modern Social Platform",
    description:
      "A modern social platform built for authentic connections and meaningful conversations.",
    images: ["/og-image.png"],
    creator: "@chatza", // optional
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem('theme');
                var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              }
            })();`,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased transition-colors duration-300`}
      >
        <ThemeProvider>{children}</ThemeProvider>

        {/* Toast container — NO COLORS HERE */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />
      </body>
    </html>
  );
}
