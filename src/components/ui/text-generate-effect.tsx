"use client";

import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.6,
  highlightWords = [],
  highlightClass = "italic text-accent-primary font-serif font-light",
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  highlightWords?: string[];
  highlightClass?: string;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (scope.current) {
      animate(
        "span.word-span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ? duration : 0.8,
          delay: stagger(0.09),
        }
      );
    }
  }, [scope, animate, filter, duration]);

  return (
    <div className={cn("font-heading leading-tight tracking-tight", className)}>
      <motion.div ref={scope} className="inline-block">
        {wordsArray.map((word, idx) => {
          const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
          const isHighlighted = highlightWords.some((hw) =>
            cleanWord.includes(hw.toLowerCase())
          );

          return (
            <motion.span
              key={word + idx}
              className={cn(
                "word-span opacity-0 inline-block transition-colors duration-300",
                isHighlighted && highlightClass
              )}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}&nbsp;
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
};
