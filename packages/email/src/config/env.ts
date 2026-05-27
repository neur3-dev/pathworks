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
  ZOHO_TOKEN: z.string().optional()
});

export const env = envSchema.parse(process.env);
