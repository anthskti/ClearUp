import express from "express";
import User from "../models/User";

const router = express.Router();

function isAwsSnsSubscribeUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    return u.protocol === "https:" && u.hostname.endsWith("amazonaws.com");
  } catch {
    return false;
  }
}

router.post("/aws-ses", async (req, res) => {
  try {
    const raw = typeof req.body === "string" ? req.body : String(req.body ?? "");
    const payload = JSON.parse(raw) as {
      Type?: string;
      SubscribeURL?: string;
      Message?: string;
    };

    if (payload.Type === "SubscriptionConfirmation") {
      const subscribeUrl = payload.SubscribeURL;
      if (!subscribeUrl || !isAwsSnsSubscribeUrl(subscribeUrl)) {
        console.error("[webhook/aws-ses] rejected SubscriptionConfirmation URL");
        return res.status(400).send("Bad Request");
      }
      await fetch(subscribeUrl);
      console.log("[webhook/aws-ses] SNS subscription confirmed");
      return res.status(200).send("OK");
    }

    if (payload.Type === "Notification" && payload.Message) {
      const message = JSON.parse(payload.Message) as {
        notificationType?: string;
        bounce?: { bouncedRecipients?: { emailAddress?: string }[] };
        complaint?: { complainedRecipients?: { emailAddress?: string }[] };
      };

      if (message.notificationType === "Bounce") {
        const recipients = message.bounce?.bouncedRecipients ?? [];
        for (const recipient of recipients) {
          const email = recipient.emailAddress;
          if (!email) continue;
          await User.update({ emailStatus: "bounced" }, { where: { email } });
          console.log(`[webhook/aws-ses] flagged ${email} as bounced`);
        }
      }

      if (message.notificationType === "Complaint") {
        const recipients = message.complaint?.complainedRecipients ?? [];
        for (const recipient of recipients) {
          const email = recipient.emailAddress;
          if (!email) continue;
          await User.update({ emailStatus: "complained" }, { where: { email } });
          console.log(`[webhook/aws-ses] flagged ${email} as complained`);
        }
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("[webhook/aws-ses] error:", error);
    return res.status(500).send("Error");
  }
});

export default router;
