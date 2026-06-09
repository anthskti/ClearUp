import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/constants/mail";

export default function TermsOfServicePage() {
  return (
    <div>
      <ProceduralWave seed={4} height={190} />
      <InfoArticle
        title="Terms of Service (TOS)"
        description="Terms that govern use of Clearup."
      >
        <h3>Terms of Service Last Updated: June 8, 2026</h3>
        <h2>Welcome to Clearup!</h2>
        <p>
          By accessing or using this website and services, you agree to be bound
          by these Terms of Service. If you do not agree to these terms, please
          do not use this platform.
        </p>
        <h2>1. The ClearUp Service</h2>
        <p>
          Clearup is a platform designed to help users build, organize, and
          track personal skincare routines, as well as discover product
          information and marketplace pricing. We reserve the right to modify,
          suspend, or discontinue any part of the Service at any time without
          notice.
        </p>
        <h2>2. Medical Disclaimer (Not Professional Advice)</h2>
        <p>
          The information provided on Clearup including routine suggestions,
          product descriptions, skin type compatibility, and community
          comments—is for informational and educational purposes only. Clearup
          is not a substitute for professional medical advice, diagnosis, or
          treatment. Always seek the advice of a qualified dermatologist or
          healthcare provider with any questions you may have regarding a skin
          condition or product reaction. Never disregard professional medical
          advice or delay in seeking it because of something you have read on
          Clearup.
        </p>
        <h2>3. Third-Party Products, Intellectual Property, and Pricing</h2>
        <p>
          Clearup gets product information, pricing, and availability from
          various third-party retailers and marketplaces.
        </p>
        <ul>
          <li>
            Data Accuracy: While we strive to keep marketplace data updated,
            product prices and availability are subject to change without
            notice. The price and availability displayed on the respective
            third-party merchant's site at the time of purchase will strictly
            dictate the final transaction.
          </li>
          <li>
            Trademarks: All product names, brand logos, and marketing images
            featured on Clearup are the intellectual property and trademarks of
            their respective owners. Clearup is an independent aggregator and is
            not affiliated with, endorsed by, or sponsored by these brands or
            retailers.
          </li>
          <li>
            Affiliate Disclosure: Clearup may participate in affiliate marketing
            programs and may allow affiliate links to be encoded on some of our
            pages. This means that we may earn a commission when you click on or
            make purchases via third-party links. We'll tell you this once it
            happens though
          </li>
        </ul>
        <h2>4. User Account and Content</h2>
        <p>
          To utilize features such as saving routines or adding user notes, you
          must create an account. You are responsible for safeguarding your
          login credentials and for all activities that occur under your
          account.
          <br />
          By posting notes, routine descriptions, or community comments on
          Clearup, you grant us a non-exclusive, royalty-free license to use,
          display, and distribute that content within the Service. We reserve
          the right to remove any user-generated content that violates these
          Terms or is deemed inappropriate, spam, or abusive.
        </p>
        <h2>5. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Clearup shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, whether incurred directly
          or indirectly, or any loss of data, use, goodwill, or other intangible
          losses, resulting from (a) your access to or use of or inability to
          access or use the Service; (b) any conduct or content of any third
          party on the Service; or (c) any adverse physical reactions to
          products discovered or tracked through the Service.
        </p>
        <h2>6. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. We will notify you of any
          changes by posting the new Terms on this page. Your continued use of
          the Service after any such changes constitutes your acceptance of the
          new Terms.
        </p>
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a href={SUPPORT_MAILTO} className="text-black hover:text-slate-800">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </InfoArticle>
    </div>
  );
}
