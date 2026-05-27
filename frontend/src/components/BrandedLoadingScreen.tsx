import Image from "next/image";
import { cn } from "@/lib/utils";

const LOADING_IMAGE_SRC = "/assets/clearupbottle.png";
const LOADING_IMAGE_ALT = "ClearUp loading artwork";
const LOADING_ACCENT_SRC = "/assets/clearuploading.png";
const LOADING_ACCENT_ALT = "ClearUp loading indicator";

type BrandedLoadingScreenProps = {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
  className?: string;
};

export default function BrandedLoadingScreen({
  title = "Loading",
  subtitle = "Preparing your ClearUp experience.",
  fullScreen = false,
  className,
}: BrandedLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full items-center justify-center bg-[#F8F8F8] px-6 py-16 text-center min-h-screen",
        className,
      )}
    >
      <div className="flex max-w-md flex-col items-center">
        <div className="relative mb-6 h-[70px] w-[70px] animate-pulse sm:h-[164px] sm:w-[164px] md:h-[150px] md:w-[150px]">
          <Image
            src={LOADING_IMAGE_SRC}
            alt={LOADING_IMAGE_ALT}
            fill
            priority
            draggable={false}
            className="object-contain drop-shadow-sm"
            sizes="(max-width: 640px) 132px, (max-width: 768px) 164px, 200px"
          />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-zinc-900">{title}</p>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>

        <div className="mt-5 flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative h-4 w-4 animate-bounce will-change-transform"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1.1s" }}
            >
              <Image
                src={LOADING_ACCENT_SRC}
                alt={LOADING_ACCENT_ALT}
                fill
                draggable={false}
                className="object-contain"
                sizes="16px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
