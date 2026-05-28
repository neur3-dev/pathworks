import * as z from 'zod';

import { defineEmail } from '../send';
import { getDefaultTemplate } from '../templates';

export const participantSeatInviteEmail = defineEmail({
  id: 'participantSeatInvite',
  subject: 'You have been invited to PathWorks',
  schema: z.object({
    participantName: z.string().min(1).optional(),
    inviterName: z.string().min(1),
    inviterRole: z.enum(['parent', 'counselor', 'advisor']),
    inviteLink: z.url(),
    expiresAt: z.string().min(1),
    planName: z.string().min(1).optional()
  }),
  render: (fields) => {
    const greeting = fields.participantName ? `Hi ${fields.participantName},` : 'Hi there,';

    const roleLabel = {
      parent: 'parent or guardian',
      counselor: 'counselor',
      advisor: 'advisor'
    }[fields.inviterRole];

    const planLine = fields.planName ? `<p>Your seat: <strong>${fields.planName}</strong>.</p>` : '';

    const content = `
      <p>${greeting}</p>
      <p><strong>${fields.inviterName}</strong> (${roleLabel}) has set up a PathWorks seat for you.</p>
      ${planLine}
      <p>This invite expires on ${fields.expiresAt} (UTC).</p>
      <div>
        <a class="button" href="${fields.inviteLink}">Accept Invitation</a>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-top:24px;">
        If the button does not work, paste this link into your browser:<br />
        <a href="${fields.inviteLink}">${fields.inviteLink}</a>
      </p>
    `;

    return getDefaultTemplate(content);
  }
});
