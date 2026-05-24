import { Resend } from "resend";
import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using:
 * 1. Resend (if RESEND_API_KEY is set) - works on Vercel, free tier
 * 2. SMTP via Nodemailer (if SMTP_HOST/USER/PASS is set)
 * 3. Console log fallback for local development
 */
export async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; messageId?: string; devLogged?: boolean }> {
  const from = process.env.EMAIL_FROM || "Stay Willas <onboarding@resend.dev>";

  // ── 1. Resend (Primary for Vercel) ──────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        console.error("❌ Resend dispatch failed:", error);
      } else {
        console.log(`✉️ Email sent via Resend to ${to}. ID: ${data?.id}`);
        return { success: true, messageId: data?.id };
      }
    } catch (error) {
      console.error("❌ Resend exception:", error);
    }
  }

  // ── 2. SMTP via Nodemailer (fallback) ────────────────────────────────────
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = parseInt(process.env.SMTP_PORT || "587");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const info = await transporter.sendMail({ from, to, subject, html });
      console.log(`✉️ Email sent via SMTP to ${to}. ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ SMTP dispatch failed:", error);
    }
  }

  // ── 3. Console / Dev fallback ────────────────────────────────────────────
  console.log(`\n══════════════════════════════════════════════
✉️  [DEV EMAIL — No sender configured]
To:      ${to}
Subject: ${subject}
══════════════════════════════════════════════
${html.replace(/<[^>]+>/g, "").trim().substring(0, 800)}
══════════════════════════════════════════════\n`);

  return { success: true, devLogged: true };
}
