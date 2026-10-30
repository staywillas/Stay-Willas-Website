import NextImage, { type ImageProps } from "next/image";
import { resolvePropertyImage } from "@/lib/property-images";
import { getPhotoFocus } from "@/lib/photo-framing";
import styles from "./site-image.module.css";

const canopyImagePrefix = "/assets/villas/canopy-crest/refresh/";
const nieevantImagePrefix = "/assets/villas/nieevant-by-stay-willas/";

export default function SiteImage({ src, style, className, ...props }: ImageProps) {
  const isCanopyPhoto = typeof src === "string" && src.includes(canopyImagePrefix);
  const isNieevantPhoto = typeof src === "string" && src.includes(nieevantImagePrefix);
  const focus = typeof src === "string" ? getPhotoFocus(src) : "50% 50%";
  const image = (
    <NextImage
      {...props}
      src={typeof src === "string" ? resolvePropertyImage(src) : src}
      className={[className, isCanopyPhoto ? styles.canopyImage : ""].filter(Boolean).join(" ")}
      unoptimized={isCanopyPhoto || isNieevantPhoto || props.unoptimized}
      data-canopy-image={isCanopyPhoto ? "true" : undefined}
      style={{ ...(focus !== "50% 50%" ? { objectPosition: focus } : {}), ...style }}
    />
  );

  if (!isCanopyPhoto) return image;

  return (
    <span
      className={`${styles.canopyPhoto} ${props.fill ? styles.fill : styles.natural}`}
      data-canopy-photo
    >
      {image}
      <span className={styles.photoProvenance}>REAL PROPERTY PHOTOS</span>
      <span className={styles.brandMark}>
        <NextImage
          src="/images/STAY WILLAS logo transparent.webp"
          alt=""
          width={160}
          height={46}
          unoptimized
        />
      </span>
    </span>
  );
}

// Fill the frame with a single sharp photo, cropped around its reviewed subject.
export function PhotoFrame({ src, alt, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px", quality = 75, className, style, ...props }: ImageProps) {
  return (
    <span className="photo-frame" data-photo-frame>
      <SiteImage {...props} src={src} alt={alt} fill sizes={sizes} quality={quality}
        data-photo-original className={"photo-frame__image " + (className || "")}
        style={{ objectFit: "cover", transform: "none", ...style }} />
    </span>
  );
}
