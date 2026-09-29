"use client";

import React from "react";
import SplitText from "@/components/SplitText";

const PolishPerfectionSection = ({
  title = "Our polish perfection edit",
  subtitle = "Full service + Production",
  description = "Research, scheduling, personalisation, personal brand manager",
  className = "",
}) => {
  return (
    <div
      className={`
        relative
        w-full
        overflow-hidden
        px-5
        pt-20
        sm:px-8
        sm:py-16
        md:px-10
        md:py-20
        lg:px-12
        lg:pt-24
        ${className}
      `}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1200px]
          flex-col
          items-center
        "
      >
        {/* Heading */}
        <SplitText
          text={title}
          className="
            m-0
            max-w-[1000px]
            text-center
            font-sans
            text-[clamp(2.4rem,6vw,4rem)]
            font-normal
            leading-[0.95]
            tracking-[-0.055em]
            text-black
          "
          delay={20}
          duration={0.9}
          ease="power3.out"
          splitType="chars"
          from={{
            opacity: 0,
            y: 45,
          }}
          to={{
            opacity: 1,
            y: 0,
          }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          toggleActions="play none none reverse"
        />

        {/* Subtitle */}
        <SplitText
          text={subtitle}
          className="
            mt-5
            text-center
            font-sans
            text-[clamp(1rem,2vw,1.45rem)]
            font-normal
            leading-tight
            tracking-[-0.025em]
            text-black
          "
          delay={15}
          duration={0.75}
          ease="power3.out"
          splitType="chars"
          from={{
            opacity: 0,
            y: 30,
          }}
          to={{
            opacity: 1,
            y: 0,
          }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          toggleActions="play none none reverse"
        />

        {/* Description */}
        <SplitText
          text={description}
          className="
            mt-4
            max-w-[360px]
            text-center
            font-sans
            text-[12px]
            italic
            leading-[1.3]
            tracking-[-0.015em]
            text-black
            sm:text-[13px]
          "
          delay={8}
          duration={0.65}
          ease="power3.out"
          splitType="chars"
          from={{
            opacity: 0,
            y: 25,
          }}
          to={{
            opacity: 1,
            y: 0,
          }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          toggleActions="play none none reverse"
        />
      </div>
    </div>
  );
};

export default PolishPerfectionSection;