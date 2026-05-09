import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function AboutUsPage() {
  return (
    <div>
      <ProceduralWave seed={7} height={190} />
      <InfoArticle
        title="About us"
        description="What ClearUp is and who builds it."
      >
        <h2>ClearUp's Goal</h2>
        <p>
          ClearUp is on a goal to bring clarity to skincare. Building an
          effective routine shouldn't require a spreadsheet and discovering new
          products shouldn't feel like a guessing game.
        </p>
        <h2>The Problem We're Solving</h2>
        <p>
          The skincare industry is massive, but managing it is overwhelming.
          Between tracking active ingredients, remembering application orders
          (AM vs. PM), and calculating the total cost of a routine, its easy to
          get lost. There isn't a centralized place to actually organize the
          products we use every day.
        </p>
        <h2>What We Do</h2>
        <p>
          ClearUp is a community-driven routine builder and discovery platform.
          We provide the tools to:
          <ul>
            <li>
              Build Your Regimen: Visually organize your morning and evening
              skincare steps.
            </li>
            <li>
              Track Your Budget: See the real cost of your daily routine at a
              glance.
            </li>
            <li>
              Discover & Share: Browse public guides and copy routines from
              users with similar skin profiles.
            </li>
          </ul>
          Whether you are a skincare minimalist or have a dedicated 10-step
          routine, ClearUp will help you track what works for your skin.
        </p>
      </InfoArticle>
    </div>
  );
}
