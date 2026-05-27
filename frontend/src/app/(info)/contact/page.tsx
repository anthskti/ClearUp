import { InfoArticle } from "@/components/info/InfoArticle";
import ProceduralWave from "@/components/themes/ProceduralWave";

export default function ContactPage() {
  return (
    <div>
      <ProceduralWave seed={5} height={190} />
      <InfoArticle title="Contact Us" description="Reach the ClearUp team.">
        <p>
          For any issues or questions, feel free to contact the lead developer:{" "}
          <a href="mailto:support.clearup@gmail.com">
            support.clearup@gmail.com
          </a>{" "}
          😊
        </p>
      </InfoArticle>
    </div>
  );
}
