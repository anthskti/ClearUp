import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function FAQPage() {
  return (
    <div>
      <ProceduralWave seed={3} height={190} />
      <InfoArticle
        title="Privacy Policy"
        description="Protecting your personal data."
      >
        <h3>Terms of Service Last Updated: May 25, 2026</h3>
        <h2>Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us
          when you register on the application, express an interest in obtaining
          information about us or our products, or otherwise contact us. The
          personal information we collect may include the following:
        </p>
        <ul>
          <li>
            Account Information: Name, email address, and authentication
            credentials used to create and secure your account.
          </li>
          <li>
            Profile & Usage Data: Skincare routines, product preferences, custom
            categories (like sunscreens and eye care), and organizational
            structures you build within the platform.
          </li>
          <li>
            Automatically Collected Information: We automatically collect
            certain information when you visit, use, or navigate the
            application. This information does not reveal your specific identity
            but may include device and usage information, such as your IP
            address, browser and device characteristics, operating system, and
            information about how and when you use our platform.
          </li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>
          We use personal information collected via our application for a
          variety of business purposes described below:
        </p>
        <ul>
          <li>
            To Facilitate Account Creation and Logon Process: We use the
            information you provide to allow you to log in, manage your profile,
            and keep your session secure.
          </li>
          <li>
            To Provide and Manage the Service: To allow you to build, customize,
            and share your skincare routines, manage your virtual product
            inventory, and ensure the core features of the platform function
            correctly.
          </li>
          <li>
            To Improve the Platform: To understand how users interact with our
            database of products and categories, allowing us to optimize our
            data scraping, categorization (e.g., proper mapping of eye creams
            and moisturizers), and overall user experience.
          </li>
        </ul>
        <h2>How We Share Your Information</h2>
        <p>
          We only share information with your consent, to comply with laws, to
          provide you with services, to protect your rights, or to fulfill
          business obligations. We may share your data with third-party service
          providers that perform services for us or on our behalf, such as
          hosting services, database management, and authentication providers.
        </p>
        <h2>Data Retention and Security</h2>
        <p>
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this privacy notice, unless a
          longer retention period is required or permitted by law. We have
          implemented appropriate technical and organizational security measures
          designed to protect the security of any personal information we
          process. However, despite our safeguards, no electronic transmission
          over the Internet or information storage technology can be guaranteed
          to be 100% secure.
        </p>
      </InfoArticle>
    </div>
  );
}
