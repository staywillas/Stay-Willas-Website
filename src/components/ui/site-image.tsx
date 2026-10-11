import NextImage, { type ImageProps } from "next/image";
import { resolvePropertyImage } from "@/lib/property-images";
import { getPhotoFocus } from "@/lib/photo-framing";

export default function SiteImage({ src, style, ...props }: ImageProps) {
  const focus = typeof src === "string" ? getPhotoFocus(src) : "50% 50%";
  return <NextImage {...props} src={typeof src === "string" ? resolvePropertyImage(src) : src}
    style={{ ...(focus !== "50% 50%" ? { objectPosition: focus } : {}), ...style }} />;
}

// Fill the frame with a single sharp photo, cropped around its reviewed subject.
export function PhotoFrame({ src, alt, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px", quality = 85, className, style, ...props }: ImageProps) {
  return (
    <span className="photo-frame" data-photo-frame>
      <SiteImage {...props} src={src} alt={alt} fill sizes={sizes} quality={quality}
        data-photo-original className={"photo-frame__image " + (className || "")}
        style={{ objectFit: "cover", transform: "none", ...style }} />
    </span>
  );
}
