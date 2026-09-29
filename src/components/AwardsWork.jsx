import { useEffect, useRef } from "react";
import gsap from "gsap";
import CircularProjectSlider from "./CircularProjectSlider";

export default function AwardsWork({ projects }) {
  const introRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".award-word",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 1.1,
          ease: "power4.out"
        }
      );
    }, introRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={introRef}>
      <section className="awards-hero">
        <div className="eyebrow">Selected work / 2026</div>
        <h1 aria-label="Work that moves">
          <span className="award-line">
            <span className="award-word">Work</span>
            <span className="award-word">that</span>
          </span>
          <span className="award-line">
            <span className="award-word">moves.</span>
          </span>
        </h1>
        <p>
          A scroll-led collection of campaigns, personal brands, films and
          digital stories. Each project gets its own stage — then folds into
          the next.
        </p>
      </section>

      <section className="all-work">
        <CircularProjectSlider projects={projects} />
      </section>

      <section className="closing">
        <div className="closing-number">06</div>
        <h2>More work<br />in progress.</h2>
        <p>Strategy, production, edit and motion — built as one system.</p>
      </section>
    </main>
  );
}
