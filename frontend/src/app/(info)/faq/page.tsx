import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function FAQPage() {
  return (
    <div>
      <ProceduralWave seed={3} height={190} />
      <InfoArticle
        title="Frequently Asked Question (FAQ)"
        description="Answers to common questions about ClearUp."
      >
        <h2>What is ClearUp?</h2>
        <p>
          ClearUp is a skincare product database, with community-driven routines
          where users can learn and build routine for skincare. In this website,
          there are provided tools to help you discover new products, track your
          routine products, and share your customized routines with others.
        </p>
        <h2>Why do I need to create an account?</h2>
        <p>
          While anyone can browse public guides and routines, creating an
          account allows you to see your old routines you've made and update
          your them too. Also, users with an account will be eligible to be
          featured on the guides page or the landing page features guides. Your
          account securely stores your routine data across your devices.
        </p>
        <h2>What kind of emails will ClearUp send me?</h2>
        <p>
          ClearUp strictly sends transactional emails required for account
          security and access. You will only receive an email from us in the
          following scenarios:
        </p>
        <ul>
          <li>
            Email Verification: A one-time link sent immediately after
            registration to verify you own the email address.
          </li>
          <li>
            Password Resets: A secure link sent only when you explicitly click
            "Forgot Password." We do not send marketing newsletters, promotional
            blasts, or bulk emails.
          </li>
        </ul>
        <h2>Will you share or sell my email address?</h2>
        <p>
          Never. Your email address is strictly used as your unique identifier
          for account login and security purposes. We do not sell, rent, or
          share our user data with third-party marketers or data brokers.
        </p>
        <h2>How do I delete my account and data?</h2>
        <p>
          You have full control over your data. You can permanently delete your
          account at any time by navigating to Profile, then Preferences, then
          scroll down to Delete Account. Put in your password (and if you signed
          with Google, just enter nothing). Initiating this action immediately
          removes your personal information, email address, and all your
          personal routines from our active database.
        </p>
        <h2>I received an email I didn't request. What should I do?</h2>
        <p>
          If you received a verification or password reset email but did not
          attempt to sign up or log in, someone may have entered your email by
          mistake. You can safely ignore the email, as the links expire
          automatically. If you have concerns, please contact my email
          personally: phamanthony47@gmail.com.
        </p>
      </InfoArticle>
    </div>
  );
}
