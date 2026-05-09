import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function TermsOfServicePage() {
  return (
    <div>
      <ProceduralWave seed={4} height={190} />
      <InfoArticle
        title="Terms of Service (TOS)"
        description="Terms that govern use of ClearUp."
      >
        <h3>Terms of Service Last Updated: May 9, 2026</h3>
        <h2>Welcome to ClearUp!</h2>
        <p>
          By accessing or using this website and services, you agree to be bound
          by these Terms of Service. If you do not agree to these terms, please
          do not use this platform.
        </p>
        <h2>1. Nature of the Platform & Medical Disclaimer</h2>
        <p>
          ClearUp is a community-driven platform designed to help users
          organize, track, and share their skincare routines. ClearUp does not
          provide medical advice. The routines, product lists, and guides shared
          on this platform are for informational and educational purposes only.
          Always consider consulting with a qualified dermatologist or
          healthcare provider before starting a new skincare routine, especially
          if you have existing skin conditions or allergies. ClearUp is not
          liable for any adverse reactions, skin damage, or health issues
          resulting from products discovered or routines copied from our
          platform.
        </p>
        <h2>2. User Accounts and Security</h2>
        <p>
          To access certain features, such as having a history of your own
          routines or being able to see your routine on the featured or guide
          page, you must register for an account. You are responsible for
          maintaining the confidentiality of your login credentials and for all
          activities that occur under your account. You agree to provide
          accurate email information during registration.
        </p>
        <h2>3. User-Generated Content</h2>
        <p>
          ClearUp allows you to create, post, and share public skincare guides
          and routines. You retain ownership of the content you create. However,
          by setting a routine to "public," you grant ClearUp a non-exclusive,
          royalty-free license to display, distribute, and reproduce that
          content across the platform. You agree not to post content that is
          illegal, abusive, harassing, or spam.
        </p>
        <h2>4. Acceptable Use Policy</h2>
        <p>
          You agree to use ClearUp only for its intended purpose. You may not:
          Use the platform to send unauthorized commercial communications or
          spam. Attempt to bypass, exploit, or hack our authentication systems
          or email verification processes. Post false, misleading, or malicious
          links within routine descriptions.
        </p>
        <h2>5. Account Termination </h2>
        <p>
          We reserve the right to suspend or terminate your account at any time,
          without notice, if we determine that you have violated these Terms of
          Service, engaged in spamming, or abused the platform's features.
        </p>
        <h2>6. Limitation of Liability</h2>
        <p>
          ClearUp is provided on an "as-is" and "as-available" basis. We make no
          warranties, expressed or implied, regarding the accuracy of product
          data, the continuous availability of the site, or the efficiency of
          any skincare routine. In no event shall ClearUp be liable for any
          direct, indirect, incidental, or consequential damages arising from
          your use of the platform.
        </p>
        <h2>7. Changes to these Terms</h2>
        <p>
          We may update these Terms of Service from time to time. We will notify
          users of significant changes by updating the "Last Updated" date at
          the top of this page.
        </p>
      </InfoArticle>
    </div>
  );
}
