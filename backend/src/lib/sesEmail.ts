import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};



/**
 * Prereqs in AWS:
 * - Verify sending domain or From address in SES
 * - If account is in sandbox, verify recipient emails too (or request production access)
 * - IAM user needs ses:SendEmail on the verified identity / region
 *
 * Env:
 * - AWS_REGION
 * - SES_FROM_EMAIL (must be verified in SES)
 * - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (or use instance role / default chain)
 */

// Send transactional mail via AWS SES (v2 API).

export async function sendSesEmail({
  to,
  subject,
  text,
  html,
}: SendEmailInput): Promise<void> {
  const region = process.env.AWS_REGION;
  const from = process.env.SES_FROM_EMAIL;

  // For development 
  if (!region || !from) {
    throw new Error(
      "SES not configured: set AWS_REGION and SES_FROM_EMAIL in the backend environment.",
    );
  }

  const client = new SESv2Client({ region });

  const bodyHtml = html ?? `<pre style="font-family:sans-serif">${escapeHtml(text)}</pre>`;

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: bodyHtml, Charset: "UTF-8" },
            Text: { Data: text, Charset: "UTF-8" },
          },
        },
      },
    }),
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
