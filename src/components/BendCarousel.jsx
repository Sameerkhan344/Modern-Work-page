"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

/*
|--------------------------------------------------------------------------
| DATA
|--------------------------------------------------------------------------
|
| 10 unique slides, matching the structure from the Framer reference.
|
| Replace these URLs with your own images/videos later.
|
*/

const slides = [
  {
    type: "image",
    src: "https://framerusercontent.com/images/mbxoRiUnuf5rRJBa57zsEmWeOsQ.jpg?width=736&height=1308",
  },
  {
    type: "video",
    src: "https://framerusercontent.com/assets/eooHxxOnxCRAzCl1OzbyaDa7GM.mp4",
    poster:
      "https://framerusercontent.com/images/dwfiex6epqBJ6gUOYY9J107Jheg.jpg?width=736&height=736",
  },
  {
    type: "image",
    src: "https://framerusercontent.com/images/p0Iv7giqJyeaMDf3NOfiOWD0Bw.png?width=674&height=1200",
  },
  {
    type: "video",
    src: "https://framerusercontent.com/assets/qsgN991u1GDn5MBnkuX9qrOg8.mp4",
    poster:
      "https://framerusercontent.com/images/PWx5hPiN2riMwBFO4wMZJAXIuHE.jpg?width=735&height=1225",
  },
  {
    type: "image",
    src: "https://framerusercontent.com/images/pPhRdX1vriNHdZgS6nCSSYXng8.jpg?width=736&height=977",
  },
  {
    type: "video",
    src: "https://framerusercontent.com/assets/xAPtScp7qNyCLLiS5XDstx18.mp4",
  },
  {
    type: "image",
    src: "https://framerusercontent.com/images/qhkf0nvYQ3eoxVGP3SO9U3EePQ.jpg?width=736&height=1104",
  },
  {
    type: "video",
    src: "https://framerusercontent.com/assets/dClAqDx2W8igpK6WWr06wAwO54.mp4",
  },
  {
    type: "image",
    src: "https://framerusercontent.com/images/AnDmzdfvR7AJWcCeZcHNK5NOGVs.jpg?width=736&height=1308",
  },
  {
    type: "video",
    src: "https://framerusercontent.com/assets/TaJcPCEBAS9WMr1q5rVFtrP3pBg.mp4",
  },
];

/*
|--------------------------------------------------------------------------
| REFERENCE SEATS
|--------------------------------------------------------------------------
|
| These are taken from the matrix3d values you provided.
|
| Seat 12 in the Framer HTML is the CENTER.
|
| Relative positions:
|
| -6  -5  -4  -3  -2  -1   0   +1 +2 +3 +4 +5
|
*/

// const SEATS = {
//   "-6": {
//     a: -0.152757,
//     b: -0.151842,
//     c: 0.447129,
//     tx: -57.9807,
//     ty: 219.582,
//     opacity: 0.69,
//     z: 40,
//   },

//   "-5": {
//     a: -0.0303313,
//     b: -0.164381,
//     c: 0.524186,
//     tx: -122.038,
//     ty: 202.19,
//     opacity: 0.69,
//     z: 40,
//   },

//   "-4": {
//     a: 0.143138,
//     b: -0.166326,
//     c: 0.623088,
//     tx: -154.29,
//     ty: 179.867,
//     opacity: 0.693663,
//     z: 40,
//   },

//   "-3": {
//     a: 0.372537,
//     b: -0.150372,
//     c: 0.741841,
//     tx: -128.425,
//     ty: 153.064,
//     opacity: 0.694424,
//     z: 40,
//   },

//   "-2": {
//     a: 0.642649,
//     b: -0.108426,
//     c: 0.866619,
//     tx: -12.3138,
//     ty: 124.901,
//     opacity: 0.784651,
//     z: 49,
//   },

//   "-1": {
//     a: 0.900201,
//     b: -0.0379402,
//     c: 0.965783,
//     tx: 211.154,
//     ty: 102.52,
//     opacity: 0.984997,
//     z: 84,
//   },

//   0: {
//     a: 1.06085,
//     b: 0.0491142,
//     c: 0.99964,
//     tx: 509.895,
//     ty: 94.8781,
//     opacity: 0.965046,
//     z: 80,
//   },

//   1: {
//     a: 1.0661,
//     b: 0.127793,
//     c: 0.951465,
//     tx: 800.112,
//     ty: 105.751,
//     opacity: 0.735224,
//     z: 45,
//   },

//   2: {
//     a: 0.934017,
//     b: 0.177903,
//     c: 0.844561,
//     tx: 1004.51,
//     ty: 129.88,
//     opacity: 0.69,
//     z: 40,
//   },

//   3: {
//     a: 0.732375,
//     b: 0.196379,
//     c: 0.71906,
//     tx: 1101.96,
//     ty: 158.206,
//     opacity: 0.69,
//     z: 40,
//   },

//   4: {
//     a: 0.521325,
//     b: 0.191614,
//     c: 0.603364,
//     tx: 1114.83,
//     ty: 184.319,
//     opacity: 0.69,
//     z: 40,
//   },

//   5: {
//     a: 0.331877,
//     b: 0.173471,
//     c: 0.508521,
//     tx: 1075.1,
//     ty: 205.725,
//     opacity: 0.69,
//     z: 40,
//   },
// };
const SEATS = {
  // =========================================================
  // LEFT OUTER
  // =========================================================

  "-6": {
    a: -0.152757,
    b: -0.151842,
    c: 0.447129,
    tx: -57.9807,
    ty: 219.582,
    opacity: 0.69,
    z: 40,
  },

  "-5": {
    a: -0.0303313,
    b: -0.164381,
    c: 0.524186,
    tx: -122.038,
    ty: 202.19,
    opacity: 0.69,
    z: 40,
  },

  "-4": {
    a: 0.143138,
    b: -0.166326,
    c: 0.623088,
    tx: -154.29,
    ty: 179.867,
    opacity: 0.693663,
    z: 40,
  },

  "-3": {
    a: 0.372537,
    b: -0.150372,
    c: 0.741841,
    tx: -128.425,
    ty: 153.064,
    opacity: 0.694424,
    z: 40,
  },

  "-2": {
    a: 0.642649,
    b: -0.108426,
    c: 0.866619,
    tx: -12.3138,
    ty: 124.901,
    opacity: 0.784651,
    z: 49,
  },

  "-1": {
    a: 0.900201,
    b: -0.0379402,
    c: 0.965783,
    tx: 211.154,
    ty: 102.52,
    opacity: 0.984997,
    z: 84,
  },

  // =========================================================
  // CENTER
  // =========================================================

  "0": {
    a: 1.06085,
    b: 0.0491142,
    c: 0.99964,
    tx: 509.895,
    ty: 94.8781,
    opacity: 0.965046,
    z: 80,
  },

  // =========================================================
  // RIGHT - MIRROR OF LEFT
  // =========================================================

  "1": {
    a: 0.900201,
    b: 0.0379402,
    c: 0.965783,
    tx: 808.636,
    ty: 102.52,
    opacity: 0.984997,
    z: 84,
  },

  "2": {
    a: 0.642649,
    b: 0.108426,
    c: 0.866619,
    tx: 1032.104,
    ty: 124.901,
    opacity: 0.784651,
    z: 49,
  },

  "3": {
    a: 0.372537,
    b: 0.150372,
    c: 0.741841,
    tx: 1148.215,
    ty: 153.064,
    opacity: 0.694424,
    z: 40,
  },

  "4": {
    a: 0.143138,
    b: 0.166326,
    c: 0.623088,
    tx: 1174.080,
    ty: 179.867,
    opacity: 0.693663,
    z: 40,
  },

  "5": {
    a: -0.0303313,
    b: 0.164381,
    c: 0.524186,
    tx: 1141.828,
    ty: 202.19,
    opacity: 0.69,
    z: 40,
  },

  "6": {
    a: -0.152757,
    b: 0.151842,
    c: 0.447129,
    tx: 1077.771,
    ty: 219.582,
    opacity: 0.69,
    z: 40,
  },
};
/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const wrap = (value, length) => {
  return ((value % length) + length) % length;
};

const shortestDistance = (index, position, length) => {
  let distance = index - position;

  if (distance > length / 2) {
    distance -= length;
  }

  if (distance < -length / 2) {
    distance += length;
  }

  return distance;
};

export default function BendCarousel() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);

  const animationRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragVelocityRef = useRef(0);

  const autoPlayRef = useRef(true);
  const lastTimeRef = useRef(0);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Get responsive scale
  |--------------------------------------------------------------------------
  */

  const getDimensions = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return {
        width: 1200,
        height: 700,
        scaleX: 1,
        scaleY: 1,
        // cardWidth: 288.9,
        cardWidth: 288.9,
        cardHeight: 451.406,
      };
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    /*
     * Original Framer reference:
     *
     * container ≈ 1200px
     * card ≈ 288.9 × 451.406
     */

    const responsiveScale = clamp(width / 1200, 0.48, 1);

    // let cardWidth = 288.9 * responsiveScale;
    let cardWidth = 288.9 * responsiveScale;
    let cardHeight = 451.406 * responsiveScale;

    /*
     * Mobile card sizing.
     */

    if (width < 640) {
      cardWidth = Math.min(width * 0.62, 245);
      cardHeight = cardWidth * 1.563;
    }

    if (width >= 640 && width < 1024) {
      cardWidth = Math.min(width * 0.3, 270);
      cardHeight = cardWidth * 1.563;
    }

    const scaleX = width / 1200;

    /*
     * Keep the vertical bend visually similar.
     */

    const scaleY = clamp(height / 700, 0.72, 1.1);

    return {
      width,
      height,
      scaleX,
      scaleY,
      cardWidth,
      cardHeight,
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Build matrix3d
  |--------------------------------------------------------------------------
  */

const buildMatrix = useCallback((seat, dimensions) => {
  const { width, height, cardWidth, cardHeight } = dimensions;

  // Seat 0 = actual center seat
  // const CENTER_TX = 509.895;
  const CENTER_TX = 360;
  // const CENTER_TY = 94.8781;
  const CENTER_TY = 90;

  // Responsive curve strength
  // let curveScale = width / 1200;
  let curveScale = width / 800;

  if (width < 1024) {
    curveScale = Math.max(0.62, Math.min(0.86, width / 1100));
  }

  if (width < 640) {
    curveScale = Math.max(0.48, Math.min(0.68, width / 900));
  }

  /*
   * The original Framer X values are based on a 1200px
   * coordinate system. We convert them into relative
   * positions around the center instead of using their
   * absolute values.
   */
  const relativeX = seat.tx - CENTER_TX;

  /*
   * Center card visual width.
   * The center seat has scaleX = 1.06085.
   */
  const centerVisualWidth =
    Math.abs(1.06085) * cardWidth;

  /*
   * This is the IMPORTANT part:
   * Put the visual center of seat 0 exactly
   * at the center of our container.
   */
  const centerTx =
    width / 2 - centerVisualWidth / 2;

  const tx =
    centerTx + relativeX * curveScale;

  /*
   * Vertical positioning
   */
  const centerTy =
    height / 2 - cardHeight * 0.50;

  const relativeY =
    seat.ty - CENTER_TY;

  // let verticalScale = 0.72;
  let verticalScale = 0;

  if (width < 1024) {
    verticalScale = 0.62;
  }

  if (width < 640) {
    verticalScale = 0.42;
  }

  const ty =
    centerTy + relativeY * verticalScale;

  /*
   * Perspective
   */
  // let perspective = -0.0003383;
  let perspective = -0.0003383;

  if (width < 1024) {
    perspective = -0.00040;
  }

  if (width < 640) {
    perspective = -0.00048;
  }

  return [
    seat.a,
    seat.b,
    0,
    seat.b * perspective,

    0,
    seat.c,
    0,
    0,

    0,
    0,
    1,
    0,

    tx,
    ty,
    0,
    1,
  ].join(",");
}, []);

  /*
  |--------------------------------------------------------------------------
  | Seat interpolation
  |--------------------------------------------------------------------------
  */

  const getSeat = useCallback((distance) => {
    /*
     * Exact seat if integer.
     */

    const lower = Math.floor(distance);
    const upper = Math.ceil(distance);

    const lowerSeat = SEATS[String(lower)];
    const upperSeat = SEATS[String(upper)];

    if (lowerSeat && upperSeat && lower === upper) {
      return lowerSeat;
    }

    /*
     * If outside our reference seats,
     * hide the card.
     */

    if (!lowerSeat && !upperSeat) {
      return null;
    }

    /*
     * Clamp to available range.
     */

    if (!lowerSeat) {
      return SEATS[String(upper)];
    }

    if (!upperSeat) {
      return SEATS[String(lower)];
    }

    /*
     * Smooth interpolation between two seats.
     */

    const t = distance - lower;

    return {
      a: lowerSeat.a + (upperSeat.a - lowerSeat.a) * t,
      b: lowerSeat.b + (upperSeat.b - lowerSeat.b) * t,
      c: lowerSeat.c + (upperSeat.c - lowerSeat.c) * t,

      tx: lowerSeat.tx + (upperSeat.tx - lowerSeat.tx) * t,

      ty: lowerSeat.ty + (upperSeat.ty - lowerSeat.ty) * t,

      opacity: lowerSeat.opacity + (upperSeat.opacity - lowerSeat.opacity) * t,

      z: Math.round(lowerSeat.z + (upperSeat.z - lowerSeat.z) * t),
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Render all cards
  |--------------------------------------------------------------------------
  */

  const render = useCallback(() => {
    const dimensions = getDimensions();

    slides.forEach((_, index) => {
      const card = cardsRef.current[index];

      if (!card) return;

      const distance = shortestDistance(
        index,
        positionRef.current,
        slides.length,
      );

      /*
       * Only render the seats that exist
       * in the Framer reference.
       */

      if (distance < -6.2 || distance > 6.2) {
        gsap.set(card, {
          x: -99999,
          y: 0,
          opacity: 0,
          zIndex: 1,
          filter: "none",
        });

        return;
      }

      const seat = getSeat(distance);

      if (!seat) return;

      const matrix = buildMatrix(seat, dimensions);

      gsap.set(card, {
        transform: `matrix3d(${matrix})`,
        opacity: seat.opacity,
        zIndex: seat.z,
        filter: "none",
      });
    });
  }, [buildMatrix, getDimensions, getSeat]);

  /*
  |--------------------------------------------------------------------------
  | Animation
  |--------------------------------------------------------------------------
  */

  const animate = useCallback(
    (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(time - lastTimeRef.current, 40) / 16.666;

      lastTimeRef.current = time;

      if (!draggingRef.current) {
        /*
         * Automatic movement.
         */

        if (autoPlayRef.current) {
          velocityRef.current += 0.00055 * delta;
        }

        /*
         * Momentum.
         */

        positionRef.current += velocityRef.current * delta;

        velocityRef.current *= Math.pow(0.92, delta);

        /*
         * Prevent crazy velocity.
         */

        velocityRef.current = clamp(velocityRef.current, -0.055, 0.055);

        positionRef.current = wrap(positionRef.current, slides.length);
      }

      render();

      animationRef.current = requestAnimationFrame(animate);
    },
    [render],
  );

  /*
  |--------------------------------------------------------------------------
  | Start animation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    render();

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, render]);

  /*
  |--------------------------------------------------------------------------
  | Resize
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      render();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [render]);

  /*
  |--------------------------------------------------------------------------
  | Pause autoplay while mouse is over slider
  |--------------------------------------------------------------------------
  */

  const handlePointerEnter = () => {
    autoPlayRef.current = false;
  };

  const handlePointerLeave = () => {
    if (!draggingRef.current) {
      autoPlayRef.current = true;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Pointer down
  |--------------------------------------------------------------------------
  */

  const handlePointerDown = (event) => {
    draggingRef.current = true;

    lastXRef.current = event.clientX;

    dragVelocityRef.current = 0;

    velocityRef.current = 0;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  /*
  |--------------------------------------------------------------------------
  | Pointer move
  |--------------------------------------------------------------------------
  */

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;

    const delta = event.clientX - lastXRef.current;

    lastXRef.current = event.clientX;

    const dimensions = getDimensions();

    /*
     * Drag sensitivity based on viewport.
     */

    const sensitivity = dimensions.width < 640 ? 0.007 : 0.0045;

    const movement = -delta * sensitivity;

    positionRef.current += movement;

    dragVelocityRef.current = movement;

    velocityRef.current = movement;

    positionRef.current = wrap(positionRef.current, slides.length);

    render();
  };

  /*
  |--------------------------------------------------------------------------
  | Pointer up
  |--------------------------------------------------------------------------
  */

  const handlePointerUp = (event) => {
    if (!draggingRef.current) return;

    draggingRef.current = false;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}

    /*
     * Add a little flick momentum.
     */

    velocityRef.current = dragVelocityRef.current * 0.9;

    autoPlayRef.current = true;
  };

  /*
  |--------------------------------------------------------------------------
  | Wheel
  |--------------------------------------------------------------------------
  */

  const handleWheel = (event) => {
    event.preventDefault();

    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    velocityRef.current += delta * 0.00045;

    velocityRef.current = clamp(velocityRef.current, -0.06, 0.06);

    autoPlayRef.current = false;

    window.clearTimeout(handleWheel.timeout);

    handleWheel.timeout = window.setTimeout(() => {
      autoPlayRef.current = true;
    }, 800);
  };

  /*
  |--------------------------------------------------------------------------
  | Find nearest position for clicked card
  |--------------------------------------------------------------------------
  */

  const getTargetPosition = (index) => {
    const current = positionRef.current;

    const currentWrapped = wrap(current, slides.length);

    let difference = index - currentWrapped;

    if (difference > slides.length / 2) {
      difference -= slides.length;
    }

    if (difference < -slides.length / 2) {
      difference += slides.length;
    }

    return current + difference;
  };

  /*
  |--------------------------------------------------------------------------
  | Open lightbox
  |--------------------------------------------------------------------------
  */

  const openLightbox = (index) => {
    autoPlayRef.current = false;

    const target = getTargetPosition(index);

    const proxy = {
      value: positionRef.current,
    };

    gsap.to(proxy, {
      value: target,
      duration: 0.65,
      ease: "power3.out",

      onUpdate: () => {
        positionRef.current = proxy.value;

        render();
      },

      onComplete: () => {
        positionRef.current = wrap(target, slides.length);

        render();

        setLightboxIndex(index);
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Close lightbox
  |--------------------------------------------------------------------------
  */

  const closeLightbox = () => {
    setLightboxIndex(null);
    autoPlayRef.current = true;
  };

  /*
  |--------------------------------------------------------------------------
  | Lightbox navigation
  |--------------------------------------------------------------------------
  */

  const previousLightbox = () => {
    setLightboxIndex((current) => {
      if (current === null) return null;

      return (current - 1 + slides.length) % slides.length;
    });
  };

  const nextLightbox = () => {
    setLightboxIndex((current) => {
      if (current === null) return null;

      return (current + 1) % slides.length;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Keyboard controls
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (lightboxIndex === null) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        previousLightbox();
      }

      if (event.key === "ArrowRight") {
        nextLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  /*
  |--------------------------------------------------------------------------
  | Current lightbox item
  |--------------------------------------------------------------------------
  */

  const lightboxItem = lightboxIndex !== null ? slides[lightboxIndex] : null;

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden bg-white">
        <div
          ref={containerRef}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onWheel={handleWheel}
          className="
            relative
            h-full
            w-full
            overflow-hidden
            touch-pan-y
            select-none
            cursor-grab
            outline-none
            active:cursor-grabbing
          "
          style={{
            touchAction: "pan-y",
          }}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
              onPointerDown={(event) => {
                /*
                 * Prevent the card click from
                 * starting a drag if it is a
                 * simple click.
                 */

                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();

                /*
                 * Don't open lightbox if user
                 * actually dragged.
                 */

                if (Math.abs(dragVelocityRef.current) > 0.01) {
                  return;
                }

                openLightbox(index);
              }}
              // w-[288.9px]
              // h-[451.406px]
              className="
  absolute
  left-0
  top-0
                w-[380px]
              h-[580px]
  overflow-hidden
  rounded-[8px]
  bg-black/[0.08]
  cursor-pointer
  [transform-origin:0_0]
  [backface-visibility:hidden]
  will-change-transform
  select-none
  max-[1023px]:w-[270px]
  max-[1023px]:h-[422px]
  max-[639px]:w-[62vw]
  max-[639px]:h-[calc(62vw*1.563)]
"
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    block
                    h-full
                    w-full
                    select-none
                    object-cover
                  "
                />
              ) : (
                <>
                  <video
                    src={item.src}
                    poster={item.poster}
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload="metadata"
                    draggable={false}
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      block
                      h-full
                      w-full
                      select-none
                      object-cover
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-3
                      right-3
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-black/35
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    <Play size={13} fill="currentColor" />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* LEFT FADE */}
          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-0
              bottom-0
              z-[200]
              w-[10%]
              bg-gradient-to-r
              from-[#e3e3e3]
              to-transparent

              max-[639px]:w-[15%]
            "
          />

          {/* RIGHT FADE */}
          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              bottom-0
              z-[200]
              w-[10%]
              bg-gradient-to-l
              from-[#e3e3e3]
              to-transparent

              max-[639px]:w-[15%]
            "
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* LIGHTBOX                                                        */}
      {/* ---------------------------------------------------------------- */}

      {lightboxItem && (
        <div
          className="
            fixed
            inset-0
            z-[999999]
            flex
            items-center
            justify-center
            bg-[rgba(9,9,10,0.94)]
            p-6
            animate-in
            fade-in
            duration-200
          "
          onClick={closeLightbox}
        >
          <div
            className="
              relative
              max-h-[86vh]
              max-w-[min(1200px,92vw)]
              overflow-hidden
              rounded-[10px]
              bg-white/[0.04]
              leading-none
              shadow-2xl
            "
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {lightboxItem.type === "image" ? (
              <img
                src={lightboxItem.src}
                alt=""
                draggable={false}
                className="
                  block
                  max-h-[86vh]
                  max-w-[min(1200px,92vw)]
                  object-contain
                "
              />
            ) : (
              <video
                key={lightboxItem.src}
                src={lightboxItem.src}
                poster={lightboxItem.poster}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="
                  block
                  max-h-[86vh]
                  max-w-[min(1200px,92vw)]
                  object-contain
                "
              />
            )}
          </div>

          {/* CLOSE */}

          <button
            type="button"
            aria-label="Close"
            onClick={closeLightbox}
            className="
              absolute
              right-5
              top-5
              z-[2]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.18]
              bg-white/[0.08]
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/[0.16]
              active:scale-95
            "
          >
            <X size={18} strokeWidth={1.7} />
          </button>

          {/* PREVIOUS */}

          <button
            type="button"
            aria-label="Previous"
            onClick={previousLightbox}
            className="
              absolute
              left-5
              top-1/2
              z-[2]
              flex
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.18]
              bg-white/[0.08]
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/[0.16]
              active:scale-95
            "
          >
            <ChevronLeft size={20} strokeWidth={1.6} />
          </button>

          {/* NEXT */}

          <button
            type="button"
            aria-label="Next"
            onClick={nextLightbox}
            className="
              absolute
              right-5
              top-1/2
              z-[2]
              flex
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.18]
              bg-white/[0.08]
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/[0.16]
              active:scale-95
            "
          >
            <ChevronRight size={20} strokeWidth={1.6} />
          </button>

          {/* COUNTER */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[22px]
              left-1/2
              -translate-x-1/2
              font-mono
              text-[12px]
              tracking-[0.08em]
              text-white/[0.72]
            "
          >
            {lightboxIndex + 1} / {slides.length}
          </div>
        </div>
      )}
    </>
  );
}

