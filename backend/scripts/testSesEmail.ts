// Test SES email sending
// Check Env for test domain email + recepient email


import path from "path";
import dotenv from "dotenv";

// Load backend/.env 
const envPath = path.resolve(__dirname, "../.env");
const loaded = dotenv.config({ path: envPath });
if (loaded.error) {
  console.warn(`[test:ses] Could not read ${envPath}:`, loaded.error.message);
} else {
  const n = loaded.parsed ? Object.keys(loaded.parsed).length : 0;
  console.log(`[test:ses] Loaded ${n} entries from ${envPath}`);
}

import { sendSesEmail } from "../src/lib/sesEmail";

async function main() {
  const region = process.env.AWS_REGION;
  const from = process.env.SES_FROM_EMAIL;
  if (!region || !from) {
    console.error(
      "[test:ses] Missing AWS_REGION or SES_FROM_EMAIL after loading .env — check backend/.env",
    );
    process.exit(1);
  }
  console.log(`[test:ses] Using region=${region}, From=${from}`);

  const to = process.env.TEST_SES_TO_EMAIL?.trim() || process.argv[2];
  if (!to) {
    console.error(
      "Missing recipient. Set TEST_SES_TO_EMAIL or pass an email:\n" +
        "  TEST_SES_TO_EMAIL=you@verified.com npm run test:ses\n" +
        "  npm run test:ses -- you@verified.com",
    );
    process.exit(1);
  }

  await sendSesEmail({
    to,
    subject: "[ClearUp] SES test",
    text: "If you received this, AWS SES + IAM + verified identities are working.",
    html: "<p>If you received this, <strong>AWS SES</strong> is working.</p>",
  });

  console.log("Sent OK to", to);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
