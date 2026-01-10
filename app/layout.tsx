import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { UserProvider } from "@/contexts/UserContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://chatza-one.vercel.app"),

  title: {
    default: "Chatza – Modern Social Platform for Authentic Connections",
    template: "%s · Chatza",
  },

  description:
    "Chatza is a modern social platform built for authentic connections, meaningful conversations, and a secure digital experience. Join millions connecting without algorithms, with premium privacy and high-res media sharing.",

  applicationName: "Chatza",

  keywords: [
    "Chatza",
    "social media",
    "social network",
    "chat application",
    "modern social platform",
    "secure chat",
    "private messaging",
    "authentic connections",
    "chronological feed",
    "no algorithm",
    "premium privacy",
    "end-to-end encryption",
    "4K photos",
    "high-res media",
    "social networking",
    "community platform",
    "Next.js app",
    "free social media",
  ],

  authors: [{ name: "Chatza Team", url: "https://chatza.com" }],

  creator: "Chatza",
  publisher: "Chatza",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chatza-one.vercel.app",
    siteName: "Chatza",
    title: "Chatza – Modern Social Platform for Authentic Connections",
    description:
      "Connect authentically with people through Chatza — a modern, secure, and beautifully designed social platform. No algorithms, premium privacy, and high-res media sharing.",
    images: [
      {
        url: "/og-image.png", // add later
        width: 1200,
        height: 630,
        alt: "Chatza – Modern Social Platform",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@chatza",
    creator: "@chatza",
    title: "Chatza – Modern Social Platform for Authentic Connections",
    description:
      "A modern social platform built for authentic connections and meaningful conversations. No algorithms, premium privacy, and high-res media sharing.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  category: "technology",

  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  alternates: {
    canonical: "https://chatza-one.vercel.app",
  },

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Chatza",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme Script */}
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

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#ef4444" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#dc2626" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />

        {/* Performance & Security */}
        <link rel="dns-prefetch" href="https://chatza-one.vercel.app" />
        <link rel="preconnect" href="https://chatza-one.vercel.app" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Chatza",
              "url": "https://chatza-one.vercel.app",
              "description": "A modern social platform built for authentic connections, meaningful conversations, and a secure digital experience.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://chatza-one.vercel.app/find?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Chatza",
              "url": "https://chatza-one.vercel.app",
              "logo": "https://chatza-one.vercel.app/logo.png",
              "sameAs": [
                "https://www.instagram.com/krxsh.in/",
                "https://www.linkedin.com/in/krish-variya/",
                "https://x.com/variya_krish_"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "url": "https://chatza-one.vercel.app/leagle/help"
              }
            })
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased transition-colors duration-300`}
      >
        <ErrorBoundary>
          <ThemeProvider>
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
        </ErrorBoundary>

        {/* Toast Provider with auto-cleanup */}
        <ToastProvider />
      </body>
    </html>
  );
}
