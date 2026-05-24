import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email utilizing production SMTP credentials if available.
 * If not configured, logs the email beautifully to the console and to `scratch/sent-emails.log`.
 */
export async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; messageId?: string; devLogged?: boolean }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "Stay Willas <staywillas@gmail.com>";

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(`✉️ Production Email dispatched to ${to}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Production SMTP dispatch failed, falling back to local logging:", error);
    }
  }

  // Local/Dev Logging Fallback
  try {
    const scratchDir = path.join(process.cwd(), "scratch");
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }

    const logPath = path.join(scratchDir, "sent-emails.log");
    const timestamp = new Date().toISOString();
    const logContent = `
======================================================================
[${timestamp}] EMAIL DISPATCHED
To: ${to}
Subject: ${subject}
----------------------------------------------------------------------
${html}
======================================================================
`;

    fs.appendFileSync(logPath, logContent, "utf8");
    console.log(`✉️ [DEVELOPMENT MODE] Local Mock Email logged for ${to} in scratch/sent-emails.log`);
    return { success: true, devLogged: true };
  } catch (err) {
    console.error("❌ Failed to log mock email to local scratch folder:", err);
    return { success: false };
  }
}
