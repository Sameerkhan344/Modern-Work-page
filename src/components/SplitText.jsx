"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text = "",
  className = "",
  delay = 50,
  duration = 1.1,
  ease = "power3.out",
  splitType = "chars",
  from = {
    opacity: 0,
    y: 40,
  },
  to = {
    opacity: 1,
    y: 0,
  },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  toggleActions = "play none none reverse",
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const items = container.querySelectorAll(".split-item");

    if (!items.length) return;

    const ctx = gsap.context(() => {
      // Set initial state BEFORE ScrollTrigger is created.
      // This prevents the text from flashing on screen.
      gsap.set(items, {
        opacity: from.opacity ?? 0,
        y: from.y ?? 40,
        x: from.x ?? 0,
        scale: from.scale ?? 1,
        rotate: from.rotate ?? 0,
        willChange: "transform, opacity",
      });

      gsap.to(items, {
        opacity: to.opacity ?? 1,
        y: to.y ?? 0,
        x: to.x ?? 0,
        scale: to.scale ?? 1,
        rotate: to.rotate ?? 0,

        duration,

        ease,

        stagger: delay / 1000,

        scrollTrigger: {
          trigger: container,

          start: "top 85%",

          toggleActions,

          invalidateOnRefresh: true,
        },

        onComplete: onLetterAnimationComplete,
      });

      ScrollTrigger.refresh();
    }, container);

    return () => {
      ctx.revert();
    };
  }, [
    delay,
    duration,
    ease,
    from,
    to,
    toggleActions,
    onLetterAnimationComplete,
  ]);

  const items =
    splitType === "words"
      ? text.split(/(\s+)/)
      : text.split("");

  return (
    <span
      ref={containerRef}
      className={`block ${className}`}
      style={{
        textAlign,
      }}
    >
      {items.map((item, index) => {
        // Preserve spaces
        if (/^\s+$/.test(item)) {
          return (
            <span key={index}>
              {item}
            </span>
          );
        }

        return (
          <span
            key={index}
            className="
              inline-block
              overflow-hidden
              align-bottom
            "
          >
            <span
              className="
                split-item
                inline-block
                will-change-transform
              "
              style={{
                opacity: from.opacity ?? 0,
                transform: `translate3d(
                  ${from.x ?? 0}px,
                  ${from.y ?? 40}px,
                  0
                )`,
              }}
            >
              {item}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default SplitText;