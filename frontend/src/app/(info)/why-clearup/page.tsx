import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function WhyClearUpPage() {
  return (
    <div>
      <ProceduralWave seed={6} height={190} />
      <InfoArticle title="Why ClearUp?" description="Why does ClearUp.">
        <h2>My Story</h2>
        <p>
          During my teenage years, I faced moments where my acne was terrible,
          so I got into skincare to take care of my skin, but the endless amount
          of products become overwhelming; I didn't know what my skintype was, I
          didn't have much money to spend, and I didn't know how to use half of
          the products I've received. So, I wanted to make a website that can
          help anybody learn how to take care of their skin via sharing their
          routines with others to learn about skincare.
        </p>
        <h2>Inspiration from this Website</h2>
        <p>
          If you have ever tried to build a computer, you probably have heard of
          PCPartPicker, this website basically find computer parts for users to
          that are compatible together, tracking price, and sharing routines
          that work for many. Applying skincare products, I thought this would
          be a great idea.
        </p>

        <h2>Still in a Work of Progress</h2>
        <p>
          Since there is only one developer making this website, not all
          features will be perfect, and not the fastest, but my goal is to water
          this website and allow it to grow, redefining the skincare space
          through helping routines.
        </p>
      </InfoArticle>
    </div>
  );
}
