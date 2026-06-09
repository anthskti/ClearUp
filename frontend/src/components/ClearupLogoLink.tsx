import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ClearupLogoLinkProps = {
  className?: string;
  priority?: boolean;
};

export default function ClearupLogoLink({
  className,
  priority = false,
}: ClearupLogoLinkProps) {
  return (
    <Link href="/" className={cn("inline-flex min-w-0 shrink", className)}>
      <Image
        src="/assets/clearuplogov11.png"
        alt="Clearup"
        width={2048}
        height={663}
        priority={priority}
        draggable={false}
        className="h-8 w-auto max-w-[min(42vw,140px)] md:h-10 md:max-w-[150px]"
      />
    </Link>
  );
}
