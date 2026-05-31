import * as z from 'zod';

const envSchema = z.object({
  SMTP_HOST: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SENDER: z.string().optional(),
  SMTP_USER: z.string().optional(),
  // Dev-only escape hatch. When 'true', the transporter skips requireTLS so
  // local SMTP catchers (mailpit / maildev) that speak plain SMTP work.
  // Do NOT set this in production - it disables transport encryption.
  SMTP_INSECURE: z.string().optional(),
  ZOHO_TOKEN: z.string().optional(),
  // Shared Postmark server token (same account as ZonDNS). When set,
  // the Postmark transport is selected ahead of Zoho and Nodemailer.
  POSTMARK_API_KEY: z.string().optional(),
  // Override the From address used for Postmark sends. Defaults to
  // "PathWorks <noreply@neur3.com>" - the shared neur3.com sender.
  POSTMARK_FROM: z.string().optional(),
  // Optional Postmark message stream. Defaults to "outbound" (the
  // transactional stream Postmark creates by default).
  POSTMARK_MESSAGE_STREAM: z.string().optional()
});

export const env = envSchema.parse(process.env);
