// SES TEST Email
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import User from "../models/User";

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
 * - SES_CONFIGURATION_SET (optional; SES config set with SNS bounce/complaint destination)
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
  const configurationSet = process.env.SES_CONFIGURATION_SET?.trim();

  if (!region || !from) {
    throw new Error(
      "SES not configured: set AWS_REGION and SES_FROM_EMAIL in the backend environment.",
    );
  }

  const row = await User.findOne({
    where: { email: to },
    attributes: ["emailStatus"],
  });
  if (row && row.emailStatus !== "active") {
    console.log(
      `[ses] skip send to ${to} (emailStatus=${row.emailStatus})`,
    );
    return;
  }

  const client = new SESv2Client({ region });

  const bodyHtml =
    html ?? `<pre style="font-family:sans-serif">${escapeHtml(text)}</pre>`;

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      ...(configurationSet
        ? { ConfigurationSetName: configurationSet }
        : {}),
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
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
