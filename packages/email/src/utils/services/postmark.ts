import type { TEmailData } from '@cio/utils/validation/mail';

import { env } from '../../config/env';
import { EmailResponse } from '../types';

const POSTMARK_API = 'https://api.postmarkapp.com/email';
const DEFAULT_POSTMARK_FROM = '"PathWorks" <noreply@neur3.com>';

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function sendWithPostmark(emailData: TEmailData): Promise<EmailResponse> {
  const { from, to, subject, content, replyTo } = emailData;

  const token = env.POSTMARK_API_KEY;
  if (!token) {
    return {
      success: false,
      error: 'POSTMARK_API_KEY not set'
    };
  }

  const fromAddress = env.POSTMARK_FROM || from || DEFAULT_POSTMARK_FROM;
  const messageStream = env.POSTMARK_MESSAGE_STREAM || 'outbound';

  try {
    const res = await fetch(POSTMARK_API, {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        From: fromAddress,
        To: to,
        Subject: subject,
        HtmlBody: content,
        TextBody: htmlToText(content),
        MessageStream: messageStream,
        ...(replyTo ? { ReplyTo: replyTo } : {})
      })
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Postmark error ${res.status}: ${body}`);
      return {
        success: false,
        error: `Postmark ${res.status}: ${body}`
      };
    }

    const result = await res.json();
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
