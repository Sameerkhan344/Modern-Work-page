"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* =========================================================
   MEDIA
========================================================= */

const MEDIA = [
  {
    id: 1,
    type: "image",
    src: "/montage/01.jpg",
  },
  {
    id: 2,
    type: "video",
    src: "https://framerusercontent.com/assets/Bk9JixCGTvqGV69oWMs21Wy1gcA.mp4",
  },
  {
    id: 3,
    type: "image",
    src: "/montage/03.jpg",
  },
  {
    id: 4,
    type: "video",
    src: "/montage/04.mp4",
  },
  {
    id: 5,
    type: "image",
    src: "/montage/05.jpg",
  },
  {
    id: 6,
    type: "video",
    src: "/montage/06.mp4",
  },
  {
    id: 7,
    type: "image",
    src: "/montage/07.jpg",
  },
  {
    id: 8,
    type: "video",
    src: "/montage/08.mp4",
  },
  {
    id: 9,
    type: "image",
    src: "/montage/09.jpg",
  },
  {
    id: 10,
    type: "video",
    src: "/montage/10.mp4",
  },
  {
    id: 11,
    type: "image",
    src: "/montage/11.jpg",
  },
  {
    id: 12,
    type: "video",
    src: "/montage/12.mp4",
  },
  {
    id: 13,
    type: "image",
    src: "/montage/13.jpg",
  },
  {
    id: 14,
    type: "video",
    src: "/montage/14.mp4",
  },
  {
    id: 15,
    type: "image",
    src: "/montage/15.jpg",
  },
];

/* =========================================================
   ROW CONFIG
========================================================= */

const ROWS = [
  {
    items: [0, 1, 2, 3, 4],
    direction: -1,
    speed: 0.28,
  },

  {
    items: [5, 6, 7, 8, 9],
    direction: 1,
    speed: 0.32,
  },

  {
    items: [10, 11, 12, 13, 14],
    direction: -1,
    speed: 0.3,
  },
];

/* =========================================================
   CARD WIDTHS
========================================================= */

const CARD_WIDTHS = [
  "w-[190px] sm:w-[250px] md:w-[300px] lg:w-[370px]",
  "w-[230px] sm:w-[290px] md:w-[350px] lg:w-[430px]",
  "w-[170px] sm:w-[230px] md:w-[280px] lg:w-[330px]",
  "w-[210px] sm:w-[270px] md:w-[330px] lg:w-[400px]",
  "w-[180px] sm:w-[240px] md:w-[290px] lg:w-[350px]",
];

/* =========================================================
   MEDIA CARD
========================================================= */

function MediaCard({ item, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`
        group
        relative
        h-[105px]
        shrink-0
        overflow-hidden
        rounded-[8px]
        bg-neutral-200
        p-0
        text-left
        outline-none
        sm:h-[125px]
        sm:rounded-[10px]
        md:h-[145px]
        lg:h-[165px]
        lg:rounded-[12px]
        ${CARD_WIDTHS[index % CARD_WIDTHS.length]}
      `}
    >
      {/* IMAGE */}
      {item.type === "image" && (
        <img
          src={item.src}
          alt=""
          draggable={false}
          loading="lazy"
          className="
            pointer-events-none
            block
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(.22,1,.36,1)]
            group-hover:scale-[1.04]
          "
        />
      )}

      {/* VIDEO */}
      {item.type === "video" && (
        <video
          src={item.src}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          className="
            pointer-events-none
            block
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(.22,1,.36,1)]
            group-hover:scale-[1.04]
          "
        />
      )}

      {/* HOVER */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/0
          transition-colors
          duration-300
          group-hover:bg-black/10
        "
      />

      {/* VIDEO ICON */}
      {item.type === "video" && (
        <span
          className="
            pointer-events-none
            absolute
            right-2
            top-2
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-black/35
            backdrop-blur-md
            sm:right-3
            sm:top-3
            sm:h-7
            sm:w-7
          "
        >
          <svg
            width="8"
            height="10"
            viewBox="0 0 8 10"
            fill="none"
          >
            <path
              d="M7.3 4.15C7.75 4.45 7.75 5.55 7.3 5.85L1.5 9.55C.9 9.9.2 9.45.2 8.75V1.25C.2.55.9.1 1.5.45L7.3 4.15Z"
              fill="white"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

/* =========================================================
   MODAL
========================================================= */

function MediaModal({ media, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [onClose]);

  useEffect(() => {
    if (media?.type !== "video") return;

    const video = videoRef.current;

    if (!video) return;

    const play = async () => {
      try {
        await video.play();
      } catch {
        // Browser autoplay restriction.
      }
    };

    play();
  }, [media]);

  if (!media) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        bg-black/80
        p-3
        backdrop-blur-[12px]
        sm:p-6
        md:p-10
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* CLOSE */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="
          fixed
          right-3
          top-3
          z-[100000]
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-white/10
          text-white
          backdrop-blur-xl
          transition-all
          duration-300
          hover:bg-white/20
          sm:right-6
          sm:top-6
          sm:h-11
          sm:w-11
        "
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M4 4L14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14 4L4 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* MEDIA */}
      <div
        className="
          relative
          flex
          max-h-[88vh]
          max-w-[95vw]
          items-center
          justify-center
          overflow-hidden
          rounded-[10px]
          bg-black
          shadow-[0_30px_100px_rgba(0,0,0,.6)]
          sm:max-h-[88vh]
          sm:max-w-[90vw]
          sm:rounded-[14px]
          md:max-w-[82vw]
        "
      >
        {media.type === "video" ? (
          <video
            ref={videoRef}
            src={media.src}
            controls
            autoPlay
            playsInline
            className="
              block
              max-h-[88vh]
              max-w-[95vw]
              object-contain
              sm:max-h-[86vh]
              sm:max-w-[90vw]
              md:max-w-[82vw]
            "
          />
        ) : (
          <img
            src={media.src}
            alt=""
            className="
              block
              max-h-[88vh]
              max-w-[95vw]
              object-contain
              sm:max-h-[86vh]
              sm:max-w-[90vw]
              md:max-w-[82vw]
            "
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN MONTAGE
========================================================= */

export default function Montage() {
  const wallRef = useRef(null);
  const trackRefs = useRef([]);

  const animationRef = useRef(null);
  const statesRef = useRef([]);

  /* TOUCH */
  const touchRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
  });

  const [activeMedia, setActiveMedia] = useState(null);

  /* =======================================================
     GET ROW ITEMS
  ======================================================= */

  const getItems = (row) => {
    return row.items.map((index) => MEDIA[index]);
  };

  /* =======================================================
     MEASURE
  ======================================================= */

  const measure = useCallback(() => {
    statesRef.current.forEach((state, index) => {
      const track = trackRefs.current[index];

      if (!track) return;

      const children = Array.from(track.children);

      if (!children.length) return;

      const halfCount = children.length / 2;

      let width = 0;

      for (let i = 0; i < halfCount; i++) {
        width += children[i].getBoundingClientRect().width;
      }

      const styles = window.getComputedStyle(track);

      const gap = parseFloat(styles.columnGap || "0");

      width += gap * (halfCount - 1);

      state.width = width;
    });
  }, []);

  /* =======================================================
     INITIALIZE
  ======================================================= */

  useEffect(() => {
    statesRef.current = ROWS.map((row) => ({
      x: 0,
      targetX: 0,
      width: 0,

      /*
       * -1 = LEFT
       * +1 = RIGHT
       */
      direction: row.direction,

      speed: row.speed,

      /*
       * Wheel momentum
       */
      velocity: 0,
    }));

    measure();

    const handleResize = () => {
      measure();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [measure]);

  /* =======================================================
     CONTINUOUS ANIMATION
  ======================================================= */

  useEffect(() => {
    let raf;

    const animate = () => {
      statesRef.current.forEach((state, index) => {
        const track = trackRefs.current[index];

        if (!track || !state.width) return;

        /*
         * --------------------------------------------------
         * NORMAL AUTO MOVEMENT
         * --------------------------------------------------
         */

        state.targetX += state.direction * state.speed;

        /*
         * --------------------------------------------------
         * WHEEL MOMENTUM
         * --------------------------------------------------
         */

        state.targetX += state.velocity;

        /*
         * Slowly reduce wheel velocity.
         */
        state.velocity *= 0.90;

        /*
         * --------------------------------------------------
         * SMOOTH MOVEMENT
         * --------------------------------------------------
         */

        state.x += (state.targetX - state.x) * 0.12;

        /*
         * --------------------------------------------------
         * INFINITE LOOP
         * --------------------------------------------------
         */

        if (state.x <= -state.width) {
          state.x += state.width;

          state.targetX += state.width;
        }

        if (state.x >= 0) {
          state.x -= state.width;

          state.targetX -= state.width;
        }

        gsap.set(track, {
          x: state.x,
        });
      });

      raf = requestAnimationFrame(animate);
      animationRef.current = raf;
    };

    raf = requestAnimationFrame(animate);
    animationRef.current = raf;

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  /* =======================================================
     DESKTOP WHEEL
  ======================================================= */

  useEffect(() => {
    const wall = wallRef.current;

    if (!wall) return;

    const handleWheel = (event) => {
      /*
       * Determine wheel movement.
       *
       * Trackpad can provide deltaX.
       * Normal mouse usually provides deltaY.
       */

      let delta = event.deltaX;

      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        delta = event.deltaY;
      }

      if (Math.abs(delta) < 0.01) {
        return;
      }

      /*
       * Prevent page from vertically scrolling
       * while the cursor is over the Montage.
       */
      event.preventDefault();

      /*
       * FAST multiplier
       */
      const FAST_SCROLL = 5.5;

      statesRef.current.forEach((state, index) => {
        if (!state) return;

        /*
         * -----------------------------------------------
         * TOP + BOTTOM
         *
         * direction = -1
         * LEFT
         * -----------------------------------------------
         */

        if (state.direction === -1) {
          state.velocity -= delta * FAST_SCROLL * 0.035;
        }

        /*
         * -----------------------------------------------
         * MIDDLE
         *
         * direction = +1
         * RIGHT
         * -----------------------------------------------
         */

        if (state.direction === 1) {
          state.velocity += delta * FAST_SCROLL * 0.035;
        }
      });
    };

    wall.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      wall.removeEventListener("wheel", handleWheel);
    };
  }, []);

  /* =======================================================
     MOBILE TOUCH
  ======================================================= */

  useEffect(() => {
    const wall = wallRef.current;

    if (!wall) return;

    const handleTouchStart = (event) => {
      const touch = event.touches[0];

      touchRef.current.active = true;
      touchRef.current.startX = touch.clientX;
      touchRef.current.startY = touch.clientY;
      touchRef.current.lastX = touch.clientX;
    };

    const handleTouchMove = (event) => {
      if (!touchRef.current.active) return;

      const touch = event.touches[0];

      const currentX = touch.clientX;
      const currentY = touch.clientY;

      const deltaX = currentX - touchRef.current.lastX;

      const totalX = currentX - touchRef.current.startX;
      const totalY = currentY - touchRef.current.startY;

      /*
       * Only take control if gesture is more horizontal
       * than vertical.
       */
      if (Math.abs(totalX) > Math.abs(totalY)) {
        event.preventDefault();

        statesRef.current.forEach((state) => {
          /*
           * Reverse according to row direction.
           */

          if (state.direction === -1) {
            state.velocity += deltaX * 0.55;
          } else {
            state.velocity -= deltaX * 0.55;
          }
        });
      }

      touchRef.current.lastX = currentX;
    };

    const handleTouchEnd = () => {
      touchRef.current.active = false;
    };

    wall.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    wall.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    wall.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    return () => {
      wall.removeEventListener("touchstart", handleTouchStart);
      wall.removeEventListener("touchmove", handleTouchMove);
      wall.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  /* =======================================================
     OPEN
  ======================================================= */

  const openMedia = useCallback((media) => {
    setActiveMedia(media);
  }, []);

  /* =======================================================
     CLOSE
  ======================================================= */

  const closeMedia = useCallback(() => {
    setActiveMedia(null);
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <section
        ref={wallRef}
        className="
          relative
          w-full
          overflow-hidden
          bg-white
          py-1.5
          sm:py-2
          md:py-3
          lg:py-4

          /*
           * Important for mobile horizontal gestures.
           */
          touch-pan-y
        "
      >
        <div
          className="
            flex
            w-full
            flex-col
            gap-1.5
            sm:gap-2
            md:gap-2.5
            lg:gap-3
          "
        >
          {ROWS.map((row, rowIndex) => {
            const items = getItems(row);

            /*
             * Duplicate cards for seamless looping.
             */
            const duplicatedItems = [
              ...items,
              ...items,
              ...items,
            ];

            return (
              <div
                key={rowIndex}
                className="
                  w-full
                  overflow-hidden
                "
              >
                <div
                  ref={(element) => {
                    trackRefs.current[rowIndex] = element;
                  }}
                  className="
                    flex
                    w-max
                    items-stretch
                    gap-1.5
                    will-change-transform
                    sm:gap-2
                    md:gap-2.5
                    lg:gap-3
                  "
                >
                  {duplicatedItems.map((item, index) => (
                    <MediaCard
                      key={`${rowIndex}-${item.id}-${index}`}
                      item={item}
                      index={index}
                      onOpen={openMedia}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================
          MODAL
      =================================================== */}

      {activeMedia && (
        <MediaModal
          media={activeMedia}
          onClose={closeMedia}
        />
      )}
    </>
  );
}