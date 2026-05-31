import { EmailResponse } from '../types';
import type { TEmailData } from '@cio/utils/validation/mail';
import type { Transporter } from 'nodemailer';
import { env } from '../../config/env';
import { EMAIL_FROM } from '../constants';
import nodemailer from 'nodemailer';

let transporter: Transporter | undefined;

const setupTransporter = async () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    console.error('SMTP configuration missing');
    return undefined;
  }

  try {
    const smtpPort = parseInt(env.SMTP_PORT || '465', 10);
    const useImplicitTls = smtpPort === 465;
    const insecure = env.SMTP_INSECURE === 'true';

    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: smtpPort,
      secure: useImplicitTls && !insecure,
      requireTLS: !useImplicitTls && !insecure,
      // ignoreTLS makes nodemailer skip STARTTLS even when the server advertises
      // it - mailpit advertises but doesn't actually implement the upgrade.
      ignoreTLS: insecure,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      },
      ...(insecure ? { tls: { rejectUnauthorized: false } } : {})
    });

    await transporter.verify();

    return transporter;
  } catch (error) {
    console.error('Transporter error:', error);
    return undefined;
  }
};

export async function sendWithNodemailer(emailData: TEmailData): Promise<EmailResponse> {
  const { from, to, subject, content, replyTo } = emailData;

  if (!transporter) {
    transporter = await setupTransporter();
  }

  if (!transporter) {
    return {
      success: false,
      error: 'Email transporter not initialized'
    };
  }

  try {
    const result = await transporter.sendMail({
      from: from ?? EMAIL_FROM,
      to,
      subject,
      replyTo,
      html: content
    });

    return {
      success: true,
      details: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    };
  }
}
