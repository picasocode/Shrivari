/* ─── Server-side mail (SMTP via nodemailer) ───
   Enquiries submitted on the website are emailed to the company mailbox.
   Credentials are NOT hard-coded: the admin panel → "Mail Settings" section
   stores them in the SiteSetting table (key: mail_settings).

   Designed for Google Workspace: SMTP host smtp.gmail.com, the account's
   full email address as the user, and a 16-character App Password
   (Google Account → Security → 2-Step Verification → App passwords). */
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

export interface MailSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  notifyTo: string;
}

export const MAIL_SETTINGS_KEY = "mail_settings";

export const DEFAULT_MAIL_SETTINGS: MailSettings = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  user: "",
  pass: "",
  fromName: "Shri Vaari Electricals Website",
  notifyTo: "",
};

export async function getMailSettings(): Promise<MailSettings> {
  try {
    const row = await db.siteSetting.findUnique({
      where: { key: MAIL_SETTINGS_KEY },
    });
    if (!row || !row.value) return DEFAULT_MAIL_SETTINGS;
    const parsed = JSON.parse(row.value);
    return { ...DEFAULT_MAIL_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_MAIL_SETTINGS;
  }
}

/* Send an email using the stored settings.
   Returns { sent: false } (never throws) when mail is not configured or
   delivery fails, so the enquiry is still saved even if mail is down. */
export async function sendMail(
  subject: string,
  html: string
): Promise<{ sent: boolean; error?: string }> {
  const settings = await getMailSettings();
  if (!settings.user || !settings.pass || !settings.notifyTo) {
    return { sent: false, error: "Mail settings are not configured yet" };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: { user: settings.user, pass: settings.pass },
    });
    await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.user}>`,
      to: settings.notifyTo,
      subject,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error("Mail send failed:", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Mail delivery failed",
    };
  }
}

/* Format a contact enquiry as a readable HTML email body. */
export function enquiryEmailHtml(enquiry: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;font-weight:600;color:#0C2340;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;color:#1A1A2E;">${value}</td></tr>`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;">
    <h2 style="color:#0C2340;margin:0 0 4px;">New Website Enquiry</h2>
    <p style="color:#6B7280;margin:0 0 16px;font-size:13px;">Submitted via the contact form on shrivaarielectricals.com</p>
    <table style="border-collapse:collapse;background:#F8FAFC;padding:8px;border-radius:8px;">
      ${row("Name", enquiry.name)}
      ${row("Email", `<a href="mailto:${enquiry.email}">${enquiry.email}</a>`)}
      ${enquiry.phone ? row("Phone", enquiry.phone) : ""}
      ${enquiry.subject ? row("Subject", enquiry.subject) : ""}
      ${row(
        "Message",
        enquiry.message
          .split("\n")
          .map((l) => `<div>${l || "&nbsp;"}</div>`)
          .join("")
      )}
    </table>
  </div>`;
}
