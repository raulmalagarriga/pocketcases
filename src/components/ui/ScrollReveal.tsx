"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "scale";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: RevealDirection;
  durationMs?: number;
  once?: boolean;
}

/**
 * Smoothly scrolls to a target element selector or id with sticky Navbar offset compensation.
 */
export function smoothScrollTo(selectorOrId: string, offsetPx = 88) {
  if (typeof window === "undefined") return;
  const selector = selectorOrId.startsWith("#")
    ? selectorOrId
    : `#${selectorOrId}`;
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const rect = target.getBoundingClientRect();
  const top = rect.top + window.scrollY - offsetPx;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

const HIDDEN_TRANSFORM_BY_DIRECTION: Record<RevealDirection, string> = {
  up: "opacity-0 translate-y-7",
  down: "opacity-0 -translate-y-7",
  left: "opacity-0 -translate-x-7",
  right: "opacity-0 translate-x-7",
  scale: "opacity-0 scale-95 translate-y-3",
};

const VISIBLE_TRANSFORM_BY_DIRECTION: Record<RevealDirection, string> = {
  up: "opacity-100 translate-y-0",
  down: "opacity-100 translate-y-0",
  left: "opacity-100 translate-x-0",
  right: "opacity-100 translate-x-0",
  scale: "opacity-100 scale-100 translate-y-0",
};

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
  durationMs = 650,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const stateClass = isVisible
    ? VISIBLE_TRANSFORM_BY_DIRECTION[direction]
    : HIDDEN_TRANSFORM_BY_DIRECTION[direction];

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
      className={`${stateClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
