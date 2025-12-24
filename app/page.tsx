'use client';
import NextImage from "next/image";
import Link from "next/link";

import appPreviewImg from "@/assets/images/landig-page-mobail.png";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io";

export default function Home() {
  return (
    <main className="overflow-x-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur border-b transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          <ThemeLogo
            className="h-15 sm:h-25 md:h-30 lg:h-20 xl:h-30 w-auto bg-none   "
          />


          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <button className="hidden sm:block text-sm sm:text-base font-medium transition-colors" style={{ color: 'var(--text-muted)' }}>
              Login
            </button>
            <Link href="auth/register" className="bg-[var(--btn-bg)] text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* Left */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Social,<br />Simplified.
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0" style={{ color: 'var(--text-muted)' }}>
            Connect without the noise. Experience a premium social media
            platform designed for people, not algorithms.
          </p>

          <div className="mt-8 sm:mt-10 flex justify-center lg:justify-start">
            <button className="bg-red-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-600 transition">
              Join Chatza
            </button>
          </div>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base flex justify-center lg:justify-start items-center gap-3" style={{ color: 'var(--text-soft)' }}>
            <span className="text-green-500 text-base sm:text-lg">✔</span>
            No money required
          </p>
        </div>

        {/* Right – Phone Mockup */}
        <div className="relative flex justify-center">
          <div className="rounded-3xl p-6 sm:p-10 shadow-2xl transition-colors" style={{ background: 'linear-gradient(to bottom right, #f6c6a8, #f3bfa5)' }}>
            <NextImage
              src={appPreviewImg}
              alt="App Preview"
              className="rounded-2xl 
                         w-[220px] sm:w-[280px] md:w-[340px] lg:w-[420px]"
            />
          </div>

          {/* Floating Like */}
          <div className="hidden md:flex absolute bottom-6 left-6 px-5 py-3 rounded-2xl shadow-xl items-center gap-3 transition-colors" style={{ backgroundColor: 'var(--card-bg)' }}>
            <span className="text-red-500 text-lg">❤️</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>New Like</p>
              <p className="text-xs" style={{ color: 'var(--text-soft)' }}>Just now</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="py-16 sm:py-24 text-center px-4 transition-colors" style={{ backgroundColor: 'var(--section-bg)' }}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Join millions of users connecting freely.
        </h2>

        <div className="flex justify-center mt-8 sm:mt-10 -space-x-4">
          {[1, 2, 3, 4].map(i => (
            <NextImage
              key={i}
              src={`https://i.pravatar.cc/64?img=${i}`}
              alt={`User avatar ${i}`}
              width={56}
              height={56}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 transition-colors"
              style={{ borderColor: 'var(--section-bg)' }}
            />
          ))}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-colors" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
            +2M
          </div>
        </div>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--text-soft)' }}>
          Our community is growing fast. Be part of a social network that respects
          your time and privacy.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <span className="text-red-500 text-sm sm:text-base font-semibold uppercase">
          Features
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Why choose Chatza?
        </h2>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          We prioritize your experience with features that matter,
          bringing back the joy of social connection.
        </p>

        <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {[
            {
              title: "Chronological Feeds",
              desc: "See posts in the order they happened. No hidden algorithms."
            },
            {
              title: "Premium Privacy",
              desc: "Your data belongs to you with end-to-end encryption."
            },
            {
              title: "High-Res Media",
              desc: "Upload 4K photos and videos for free."
            }
          ].map(item => (
            <div
              key={item.title}
              className="p-8 sm:p-10 rounded-2xl border hover:shadow-2xl transition" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <h3 className="font-bold text-lg sm:text-xl" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="rounded-[40px] py-16 sm:py-24 text-center px-6 sm:px-20 transition-colors" style={{ backgroundColor: 'var(--cta-bg)', color: 'var(--cta-text)' }}>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Ready to start the conversation?
          </h2>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            Join the fastest growing social platform today.
          </p>

          <div className="mt-8 sm:mt-10 flex justify-center">
            <button className="bg-red-500 text-amber-50 px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-red-600 transition">
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between gap-12">

            {/* Brand */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2 font-bold text-lg">
                <ThemeLogo className="h-20 sm:h-25 md:h-30 lg:h-35 xl:h-35 w-auto" />
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                A modern social platform built for authentic connections.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">

              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Product</h4>
                <ul className="space-y-3" style={{ color: 'var(--text-soft)' }}>
                  <li>Features</li>
                  <li>Mobile App</li>
                  <li>Security</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Company</h4>
                <ul className="space-y-3" style={{ color: 'var(--text-soft)' }}>
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Blog</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
                <ul className="space-y-3" style={{ color: 'var(--text-soft)' }}>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-color)' }}>

            {/* Copyright */}
            <p className="text-xs" style={{ color: 'var(--text-soft)' }}>
              © {new Date().getFullYear()} Chatza Inc. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 transition-colors" style={{ color: 'var(--text-soft)' }}>
              <a href="https://www.instagram.com/krxsh.in/" className="text-lg cursor-pointer transition" style={{ color: 'inherit' }}><IoLogoInstagram /></a>
              <a href="kedin.com/in/krish-variya/" className="text-lg cursor-pointer transition" style={{ color: 'inherit' }}><FaLinkedin /></a>
              <a href="https://x.com/variya_krish_" className="text-lg cursor-pointer transition" style={{ color: 'inherit' }}><FaXTwitter /></a>
            </div>

          </div>
        </div>
      </footer>


    </main>
  );
}
