import Image, { type ImageProps } from "next/image";

// Check if the image is a local image
function isLocalImageSrc(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return true;
  if (!src) return true;
  return src.startsWith("/") && !src.startsWith("//");
}

// If the image is a local image, use the default optimizer
// If the image is a remote image, use the remote image optimizer
export default function ProductImage(props: ImageProps) {
  const unoptimized = !isLocalImageSrc(props.src);
  return <Image {...props} unoptimized={unoptimized} />;
}
