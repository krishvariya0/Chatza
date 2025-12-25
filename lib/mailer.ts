'use server';

import nodemailer from 'nodemailer';

const user = process.env.SMTP_SERVER_USERNAME;
const pass = process.env.SMTP_SERVER_PASSWORD;

if (!user || !pass) {
  throw new Error('SMTP credentials missing');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
});

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html: string;
}) {
  await transporter.verify();

  return transporter.sendMail({
    from: `Chatza Support <${user}>`,
    to,
    subject,
    text,
    html,
  });
}
