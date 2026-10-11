"use client";

import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./hover-border-gradient.module.css";

interface HoverBorderGradientProps extends HTMLAttributes<HTMLElement> {
  as?: "button" | "div";
  containerClassName?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function HoverBorderGradient({
  as = "button", containerClassName, className, children, type = "button", disabled, ...props
}: HoverBorderGradientProps) {
  return <div className={cn(styles.border, containerClassName)}>
    {createElement(as, {
      ...props,
      ...(as === "button" ? { type, disabled } : {}),
      className: cn(styles.content, className),
    }, children)}
  </div>;
}
