import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function AboutUsPage() {
  return (
    <div>
      <ProceduralWave seed={7} height={190} />
      <InfoArticle title="About Clearup" description="What is the purpose of Clearup?">
        <h2>The Problem</h2>
        <p>
          When I was a teenager, I faced moments where my acne was terrible, so
          I got into skincare to take care of my skin, but the endless amount of
          products become overwhelming; I didn't know what my skin type was, I
          didn't have much to spend, and I didn't know how to use half of the
          products I've received. So, I wanted to make a website that can help
          anybody learn how to take care of their skin via sharing their
          routines with others to learn about skincare.
        </p>
        <p>
          The skincare industry is massive, yet there was no centralized place
          to organize products, remember application orders (AM vs PM), or
          calculate costs without relying on messy spreadsheets. Building an
          effective routine shouldn't require spending hundreds of dollars on a
          whim or guessing what combinations are safe.
        </p>
        <h2>The Solution</h2>
        <p>
          Clearup is on a goal to bring clarity to skincare. Building an
          effective routine shouldn't require spending hundreds on potential
          products, having spreadsheet of what work, and feeling like looking at
          new products is a guessing game.
        </p>
        <p>
          Clearup is a community-driven routine builder and discovery platform.
          We provide the tools to:
        </p>
        <ul>
          <li>
            Build Your Routine: Visually organize your morning and evening
            skincare steps.
          </li>
          <li>
            Track Your Budget: See the real cost of your daily routine at a
            glance.
          </li>
          <li>
            Discover & Share: Browse public guides and copy routines from users
            with similar skin profiles.
          </li>
        </ul>
        <h2>Growing Together</h2>
        <p>
          Whether you are a skincare minimalist or have a dedicated 10-step
          routine, Clearup will help you track what works for your skin. As a
          solo developer, my goal is to continuously grow and refine this
          platform alongside the community, redefining how we share and learn
          about skincare.
        </p>
      </InfoArticle>
    </div>
  );
}
