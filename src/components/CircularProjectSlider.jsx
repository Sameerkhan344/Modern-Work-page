import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProjectVideo from "./ProjectVideo";

const clampIndex = (index, length) => {
  if (!length) return 0;
  return ((index % length) + length) % length;
};

export default function CircularProjectSlider({ projects }) {
  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const wheelLockRef = useRef(false);
  const touchStartRef = useRef(null);
  const [active, setActive] = useState(0);

  const getRelative = useCallback((index) => {
    const length = projects.length;
    let diff = index - active;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  }, [active, projects.length]);

  const render = useCallback((animate = true) => {
    const cards = cardsRef.current.filter(Boolean);
    const ease = "power3.out";

    cards.forEach((card, index) => {
      const d = getRelative(index);
      const abs = Math.abs(d);
      const visible = abs <= 2;

      const x = d * 46;
      const z = d === 0 ? 80 : -Math.min(abs, 3) * 115;
      const y = d === 0 ? 0 : Math.min(abs, 2) * 22;
      const rotateY = d * -18;
      const rotateZ = d * (abs === 1 ? 1.2 : 2.2);
      const scale = d === 0 ? 1 : abs === 1 ? 0.78 : 0.62;
      const opacity = d === 0 ? 1 : abs === 1 ? 0.78 : abs === 2 ? 0.38 : 0;
      const blur = d === 0 ? 0 : Math.min(abs, 2) * 1.8;

      const vars = {
        xPercent: x,
        y,
        z,
        rotateY,
        rotateZ,
        scale,
        opacity,
        filter: `blur(${blur}px)`,
        pointerEvents: d === 0 ? "auto" : "none",
        zIndex: 20 - abs
      };

      if (!visible) vars.visibility = "hidden";
      else vars.visibility = "visible";

      gsap.to(card, {
        ...vars,
        duration: animate ? 0.72 : 0,
        ease,
        overwrite: true
      });
    });
  }, [getRelative]);

  const goTo = useCallback((next, animate = true) => {
    const nextIndex = clampIndex(next, projects.length);
    setActive(nextIndex);
  }, [projects.length]);

  useEffect(() => {
    render(false);
  }, [render]);

  useEffect(() => {
    render(true);
  }, [active, render]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.deltaY;

      if (Math.abs(delta) < 12 || wheelLockRef.current) return;

      wheelLockRef.current = true;
      goTo(active + (delta > 0 ? 1 : -1));

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 520);
    };

    const onTouchStart = (event) => {
      touchStartRef.current = event.touches[0]?.clientX ?? null;
    };

    const onTouchEnd = (event) => {
      const start = touchStartRef.current;
      const end = event.changedTouches[0]?.clientX;
      touchStartRef.current = null;
      if (start == null || end == null) return;

      const distance = start - end;
      if (Math.abs(distance) < 45) return;
      goTo(active + (distance > 0 ? 1 : -1));
    };

    root.addEventListener("wheel", onWheel, { passive: true });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, goTo]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") goTo(active + 1);
      if (event.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, goTo]);

  return (
    <section className="work-slider" ref={rootRef}>
      <div className="slider-topline">
        <span>Selected work</span>
        <span>Drag / scroll / swipe</span>
      </div>

      <div className="slider-stage">
        <div className="slider-orbit" aria-hidden="true" />
        <div className="slider-cards">
          {projects.map((project, index) => (
            <article
              className={`work-card ${index === active ? "is-active" : ""}`}
              key={project.id}
              ref={(node) => {
                cardsRef.current[index] = node;
              }}
              onClick={() => goTo(index)}
              style={{ "--accent": project.accent }}
            >
              <ProjectVideo
                src={project.video}
                poster={project.poster}
                active={index === active}
                title={project.title}
              />
              <div className="card-index">{project.tag}</div>
            </article>
          ))}
        </div>

        <button
          className="slider-arrow slider-arrow-left"
          onClick={() => goTo(active - 1)}
          aria-label="Previous project"
        >
          ←
        </button>
        <button
          className="slider-arrow slider-arrow-right"
          onClick={() => goTo(active + 1)}
          aria-label="Next project"
        >
          →
        </button>
      </div>

      <div className="slider-copy" aria-live="polite">
        <div className="copy-meta">
          <span>{projects[active].id}</span>
          <span>{projects[active].subtitle}</span>
        </div>
        <h2>{projects[active].title}</h2>
        <p>{projects[active].description}</p>
      </div>

      <div className="slider-dots" role="tablist" aria-label="Projects">
        {projects.map((project, index) => (
          <button
            key={project.id}
            className={index === active ? "is-active" : ""}
            onClick={() => goTo(index)}
            aria-label={`Show project ${index + 1}`}
            aria-selected={index === active}
            role="tab"
          >
            <span />
          </button>
        ))}
      </div>
    </section>
  );
}
