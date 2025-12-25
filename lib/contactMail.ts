'use server';

import { sendMail } from "./mailer";

/* =========================
   Contact Form Mail Helper
========================= */
export async function sendContactMail({
    name,
    email,
    message,
}: {
    name: string;
    email: string;
    message: string;
}) {
    return sendMail({
        to: process.env.SMTP_SERVER_USERNAME!, // admin email
        subject: "📩 New Contact Message - Chatza",
        html: `
<div style="
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
">

  <!-- Header -->
  <div style="
    background-color: #fb2c36;
    padding: 18px 24px;
    color: #ffffff;
  ">
    <h2 style="margin: 0; font-size: 20px;">
      Chatza Support
    </h2>
    <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">
      New Contact Form Submission
    </p>
  </div>

  <!-- Body -->
  <div style="padding: 24px; color: #111827;">

    <p style="margin-top: 0;">
      You’ve received a new message from the Chatza help page.
    </p>

    <div style="
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 16px;
      margin: 16px 0;
    ">
      <p style="margin: 0 0 8px;">
        <strong>Name:</strong> ${name}
      </p>
      <p style="margin: 0 0 8px;">
        <strong>Email:</strong> ${email}
      </p>
      <p style="margin: 0;">
        <strong>Message:</strong><br />
        ${message}
      </p>
    </div>

    <p style="font-size: 13px; color: #6b7280;">
      You can reply directly to this email to respond to the user.
    </p>

  </div>

  <!-- Footer -->
  <div style="
    padding: 16px;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
  ">
    © ${new Date().getFullYear()} Chatza · All rights reserved
  </div>

</div>
`,

    });
}
