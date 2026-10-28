"use client";

import { useEffect, useState } from "react";
import CircularCarousel, {
  type CircularCarouselItem,
} from "@/components/CircularCarousel";

export default function AreaHeroCarousel({
  items,
  className,
}: {
  items: CircularCarouselItem[];
  className?: string;
}) {
  const [cardWidth, setCardWidth] = useState(220);

  useEffect(() => {
    const largeDesktop = window.matchMedia("(min-width: 1650px)");
    const desktop = window.matchMedia("(min-width: 1200px)");
    const tablet = window.matchMedia("(min-width: 701px)");
    const updateCardWidth = () => {
      setCardWidth(
        largeDesktop.matches ? 390 : desktop.matches ? 360 : tablet.matches ? 280 : 220,
      );
    };

    updateCardWidth();
    largeDesktop.addEventListener("change", updateCardWidth);
    desktop.addEventListener("change", updateCardWidth);
    tablet.addEventListener("change", updateCardWidth);

    return () => {
      largeDesktop.removeEventListener("change", updateCardWidth);
      desktop.removeEventListener("change", updateCardWidth);
      tablet.removeEventListener("change", updateCardWidth);
    };
  }, []);

  return (
    <CircularCarousel
      items={items}
      preset="cylinder"
      intro="rise"
      cardWidth={cardWidth}
      aspectRatio={1}
      speed={14}
      captions={false}
      gap={25}
      tilt={-5}
      curve={1}
      perspective={2500}
      autoplay="drift"
      interval={3}
      direction="left"
      momentum={0.6}
      snap
      pauseOnHover
      focusOnClick
      draggable
      parallax={0.3}
      stretch={0.5}
      fadeColor="#102239"
      depthFade={0.55}
      innerShade={0.6}
      cornerRadius={12}
      className={className}
    />
  );
}
