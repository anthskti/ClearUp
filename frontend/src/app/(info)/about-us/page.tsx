import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function AboutUsPage() {
  return (
    <div>
      <ProceduralWave seed={7} height={190} />
      <InfoArticle title="About us" description="What is ClearUp?">
        <h2>ClearUp's Goal</h2>
        <p>
          ClearUp is on a goal to bring clarity to skincare. Building an
          effective routine shouldn't require spending hundreds on potential
          products, having spreadsheet of what work, and feeling like looking at
          new products is a guessing game.
        </p>
        <h2>The Problem We're Solving</h2>
        <p>
          The skincare industry is massive, but managing it is overwhelming.
          Between tracking what products suit you your skin the best,
          remembering application orders (AM vs. PM), calculating the total cost
          of a routine, and finding the best price, its easy to get lost. There
          isn't a centralized place to actually organize the products we use
          every day.
        </p>
        <h2>What We Do</h2>
        <p>
          ClearUp is a community-driven routine builder and discovery platform.
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
        <p>
          Whether you are a skincare minimalist or have a dedicated 10-step
          routine, ClearUp will help you track what works for your skin.
        </p>
      </InfoArticle>
    </div>
  );
}
