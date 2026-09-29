// "use client";
// import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// // True when the user has asked the OS to minimise animation. Safe to call
// // during render - returns false on the server.
// function prefersReducedMotion() {
//     if (typeof window === "undefined")
//         return false;
//     return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
// }
// // Reduced motion: a much larger perspective distance flattens the 3D card
// // rotation (less depth distortion) instead of removing it outright.
// const REDUCED_PERSPECTIVE = "4800px";
// const MOBILE_BREAKPOINT = 640;
// const TABLET_BREAKPOINT = 1025;
// const MOBILE_STEP = 2;
// const TABLET_STEP = 6;
// const DESKTOP_STEP = 10;
// const MOBILE_ROTATE_IN = -60;
// const TABLET_ROTATE_IN = -80;
// const DESKTOP_ROTATE_IN = -100;
// const MOBILE_ROTATE_OUT = 50;
// const TABLET_ROTATE_OUT = 65;
// const DESKTOP_ROTATE_OUT = 80;
// const ROTATE_X_NEGATIVE = 5;
// const ROTATE_X_POSITIVE = -5;
// // Reduced motion: cut the card rotation down a lot (not just the perspective
// // flattening above) - "reduce a lot", so a stronger cut than the 25% factor
// // used elsewhere.
// const ROTATION_REDUCTION_FACTOR = 0.15;
// const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
// gsap.registerPlugin(ScrollTrigger);
// export function RotationSliderComp({ images, rotationAmount = 1, verticalDrift = 1, scrollSmoothing = 1, perspective = 1200, showCaptions = true, textColor = "#ffffff", }) {
//     const outerRef = useRef(null);
//     const trackRef = useRef(null);
//     const cardsRef = useRef([]);
//     const wrappersRef = useRef([]);
//     const reducedMotion = prefersReducedMotion();
//     useEffect(() => {
//         const outer = outerRef.current;
//         const track = trackRef.current;
//         if (!outer || !track)
//             return;
//         const onResize = () => {
//             const travel = track.scrollWidth - window.innerWidth;
//             outer.style.height = `${travel + window.innerHeight}px`;
//         };
//         onResize();
//         const resizeObserver = new ResizeObserver(onResize);
//         resizeObserver.observe(track);
//         window.addEventListener("resize", onResize);
//         return () => {
//             resizeObserver.disconnect();
//             window.removeEventListener("resize", onResize);
//         };
//     }, [images]);
//     useIsomorphicLayoutEffect(() => {
//         const outer = outerRef.current;
//         const track = trackRef.current;
//         if (!outer || !track)
//             return;
//         const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
//         const isTablet = window.innerWidth >= MOBILE_BREAKPOINT &&
//             window.innerWidth < TABLET_BREAKPOINT;
//         const context = gsap.context(() => {
//             const horizontalTween = gsap.to(track, {
//                 x: () => -(track.scrollWidth - window.innerWidth),
//                 ease: "none",
//                 scrollTrigger: {
//                     trigger: outer,
//                     start: "top top",
//                     end: () => `+=${track.scrollWidth - window.innerWidth}`,
//                     // Reduced motion: scrub:true tracks scroll position
//                     // directly (no smoothing lag) instead of the ~1s
//                     // catch-up delay - the "lerp" here is that scrub value.
//                     scrub: reducedMotion ? true : scrollSmoothing,
//                     invalidateOnRefresh: true,
//                 },
//             });
//             cardsRef.current.forEach((card, index) => {
//                 const wrapper = wrappersRef.current[index];
//                 if (!card || !wrapper)
//                     return;
//                 const total = images.length;
//                 const mid = Math.floor(total / 2);
//                 const step = (isMobile
//                     ? MOBILE_STEP
//                     : isTablet
//                         ? TABLET_STEP
//                         : DESKTOP_STEP) * verticalDrift;
//                 let offset;
//                 if (index < mid) {
//                     offset = -((mid - index) * step);
//                 }
//                 else {
//                     offset = (index - mid + 1) * step;
//                 }
//                 const rotationScale = reducedMotion ? ROTATION_REDUCTION_FACTOR : 1;
//                 const rotateXValue = (offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE) * rotationScale;
//                 const rotateInValue = (isMobile
//                     ? MOBILE_ROTATE_IN
//                     : isTablet
//                         ? TABLET_ROTATE_IN
//                         : DESKTOP_ROTATE_IN) * rotationScale * rotationAmount;
//                 const rotateOutValue = (isMobile
//                     ? MOBILE_ROTATE_OUT
//                     : isTablet
//                         ? TABLET_ROTATE_OUT
//                         : DESKTOP_ROTATE_OUT) * rotationScale * rotationAmount;
//                 const tl = gsap.timeline({
//                     scrollTrigger: {
//                         trigger: wrapper,
//                         containerAnimation: horizontalTween,
//                         start: "left 100%",
//                         end: "right 0%",
//                         scrub: true,
//                         // markers:true
//                     },
//                 });
//                 tl.fromTo(card, {
//                     rotateY: rotateInValue,
//                     rotateX: rotateXValue,
//                     opacity: 0.8,
//                     y: `${offset}vh`,
//                 }, {
//                     rotateY: 0,
//                     rotateX: 0,
//                     opacity: 1,
//                     y: 0,
//                     ease: "none",
//                 }).to(card, {
//                     rotateY: rotateOutValue,
//                     opacity: 0.9,
//                     y: `${-offset}vh`,
//                     ease: "none",
//                 });
//             });
//             ScrollTrigger.refresh();
//         });
//         return () => context.revert();
//     }, [images, rotationAmount, verticalDrift, scrollSmoothing]);
//     return (<div ref={outerRef} className="relative bg-white">
//             <div className="sticky top-0 flex h-screen items-center overflow-hidden" style={{ perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px` }}>
//                 <div ref={trackRef} className="
//             flex h-full items-center will-change-transform
//             gap-[5vw] max-[1025px]:gap-[8vw] max-md:gap-[12vw]
//             pl-[31vw] pr-[31vw]
//             max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw]
//             max-md:pl-[12vw] max-md:pr-[12.5vw]
//           " style={{ transformStyle: "preserve-3d" }}>
//                     {images.map((img, index) => (<div key={index} ref={(element) => {
//                 wrappersRef.current[index] = element;
//             }} className="
//                 relative flex h-[45vh] w-[38vw] shrink-0 items-center justify-center
//                 max-[1025px]:h-[40vh] max-[1025px]:w-[55vw]
//                 max-md:h-[35vh] max-md:w-[75vw]
//                 max-[1025px]:[&>div]:h-[40vh] max-[1025px]:[&>div]:w-[50vw]
//                 max-md:[&>div]:h-[35vh] max-md:[&>div]:w-[75vw]
//               " style={{ transformStyle: "preserve-3d" }}>
//                             <RotationCard ref={(element) => {
//                 cardsRef.current[index] = element;
//             }} src={img.src} text={img.text} index={index} total={images.length} showCaptions={showCaptions} textColor={textColor}/>
//                         </div>))}
//                 </div>

//             </div>
//         </div>);
// }
// const RotationCard = forwardRef(({ src, index, total, text, showCaptions, textColor }, ref) => {
//     return (<div ref={ref} className="absolute h-[45vh] w-[38vw] origin-right overflow-hidden opacity-0 max-md:h-[35vh] max-md:w-[75vw]" style={{
//             transformStyle: "preserve-3d",
//             zIndex: total - index,
//         }}>
//             <div className="relative h-full w-full" style={{
//             transformStyle: "preserve-3d",
//         }}>
//                 <img src={src} alt="slider" className="absolute inset-0 h-full w-full object-cover"/>
//             </div>

//             {showCaptions && text && (<div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-[1.4vw] font-medium max-[1025px]:text-[2.4vw] max-md:text-[4vw]" style={{
//                 color: textColor,
//                 textShadow: "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
//             }}>
//                     {text}
//                 </div>)}
//         </div>);
// });
// RotationCard.displayName = "RotationCard";

// "use client";

// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";

// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import {
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Pause,
// } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// /* =========================================================
//    HELPERS
// ========================================================= */

// function prefersReducedMotion() {
//   if (typeof window === "undefined") {
//     return false;
//   }

//   return (
//     window.matchMedia?.(
//       "(prefers-reduced-motion: reduce)"
//     )?.matches ?? false
//   );
// }

// function isVideoSource(src = "") {
//   const cleanSrc = src
//     .split("?")[0]
//     .split("#")[0];

//   return /\.(mp4|webm|ogg|m4v)$/i.test(
//     cleanSrc
//   );
// }

// const useIsomorphicLayoutEffect =
//   typeof window !== "undefined"
//     ? useLayoutEffect
//     : useEffect;

// /* =========================================================
//    BREAKPOINTS
// ========================================================= */

// const MOBILE_BREAKPOINT = 640;
// const TABLET_BREAKPOINT = 1025;

// /* =========================================================
//    ROTATION
// ========================================================= */

// const MOBILE_STEP = 2;
// const TABLET_STEP = 6;
// const DESKTOP_STEP = 10;

// const MOBILE_ROTATE_IN = -60;
// const TABLET_ROTATE_IN = -80;
// const DESKTOP_ROTATE_IN = -100;

// const MOBILE_ROTATE_OUT = 50;
// const TABLET_ROTATE_OUT = 65;
// const DESKTOP_ROTATE_OUT = 80;

// const ROTATE_X_NEGATIVE = 5;
// const ROTATE_X_POSITIVE = -5;

// const ROTATION_REDUCTION_FACTOR = 0.15;

// const REDUCED_PERSPECTIVE = "4800px";

// /* =========================================================
//    MAIN
// ========================================================= */

// export function RotationSliderComp({
//   images = [],

//   rotationAmount = 1,

//   verticalDrift = 1,

//   scrollSmoothing = 1,

//   perspective = 1200,

//   showCaptions = true,

//   textColor = "#ffffff",

//   videoMuted = true,

//   videoLoop = true,

//   videoPlaysInline = true,
// }) {
//   const outerRef = useRef(null);

//   const trackRef = useRef(null);

//   const cardsRef = useRef([]);

//   const wrappersRef = useRef([]);

//   const videosRef = useRef([]);

//   const horizontalTweenRef =
//     useRef(null);

//   const navigationTweenRef =
//     useRef(null);

//   const reducedMotion =
//     prefersReducedMotion();

//   const [activeIndex, setActiveIndex] =
//     useState(0);

//   const [playingIndex, setPlayingIndex] =
//     useState(null);

//   /* =======================================================
//      CLEAR REFS WHEN DATA CHANGES
//   ======================================================= */

//   useEffect(() => {
//     cardsRef.current = [];
//     wrappersRef.current = [];
//     videosRef.current = [];

//     setActiveIndex(0);
//     setPlayingIndex(null);
//   }, [images]);

//   /* =======================================================
//      UPDATE HEIGHT
//   ======================================================= */

//   useEffect(() => {
//     const outer =
//       outerRef.current;

//     const track =
//       trackRef.current;

//     if (!outer || !track) {
//       return;
//     }

//     const updateHeight = () => {
//       const travel = Math.max(
//         0,
//         track.scrollWidth -
//           window.innerWidth
//       );

//       /*
//        * IMPORTANT:
//        *
//        * ScrollTrigger needs enough
//        * vertical space to perform
//        * the complete horizontal travel.
//        */
//       outer.style.height =
//         `${travel + window.innerHeight}px`;
//     };

//     updateHeight();

//     const observer =
//       new ResizeObserver(
//         updateHeight
//       );

//     observer.observe(track);

//     window.addEventListener(
//       "resize",
//       updateHeight
//     );

//     return () => {
//       observer.disconnect();

//       window.removeEventListener(
//         "resize",
//         updateHeight
//       );
//     };
//   }, [images]);

//   /* =======================================================
//      STOP ALL VIDEOS
//   ======================================================= */

//   const stopAllVideos = useCallback(
//     (exceptIndex = null) => {
//       videosRef.current.forEach(
//         (video, index) => {
//           if (!video) {
//             return;
//           }

//           if (
//             index !== exceptIndex
//           ) {
//             video.pause();
//           }
//         }
//       );

//       if (
//         exceptIndex === null
//       ) {
//         setPlayingIndex(null);
//       }
//     },
//     []
//   );

//   /* =======================================================
//      REGISTER VIDEO
//   ======================================================= */

//   const registerVideo =
//     useCallback(
//       (index, video) => {
//         videosRef.current[
//           index
//         ] = video;
//       },
//       []
//     );

//   /* =======================================================
//      PLAY VIDEO
//   ======================================================= */

//   const playVideo = useCallback(
//     async (index) => {
//       const video =
//         videosRef.current[index];

//       if (!video) {
//         return;
//       }

//       /*
//        * Pause every other video first.
//        */
//       videosRef.current.forEach(
//         (otherVideo, otherIndex) => {
//           if (
//             otherVideo &&
//             otherIndex !== index
//           ) {
//             otherVideo.pause();
//           }
//         }
//       );

//       try {
//         /*
//          * Calling load() isn't necessary and
//          * can interrupt playback.
//          */

//         await video.play();

//         setPlayingIndex(index);
//       } catch (error) {
//         console.error(
//           "Video playback failed:",
//           error
//         );

//         setPlayingIndex(null);
//       }
//     },
//     []
//   );

//   /* =======================================================
//      PAUSE VIDEO
//   ======================================================= */

//   const pauseVideo = useCallback(
//     (index) => {
//       const video =
//         videosRef.current[index];

//       if (!video) {
//         return;
//       }

//       video.pause();

//       setPlayingIndex(
//         (current) =>
//           current === index
//             ? null
//             : current
//       );
//     },
//     []
//   );

//   /* =======================================================
//      TOGGLE VIDEO
//   ======================================================= */

//   const toggleVideo =
//     useCallback(
//       (index) => {
//         const video =
//           videosRef.current[index];

//         if (!video) {
//           console.warn(
//             `Video ref ${index} not found`
//           );

//           return;
//         }

//         if (video.paused) {
//           playVideo(index);
//         } else {
//           pauseVideo(index);
//         }
//       },
//       [
//         playVideo,
//         pauseVideo,
//       ]
//     );

//   /* =======================================================
//      GSAP HORIZONTAL SCROLL
//   ======================================================= */

//   useIsomorphicLayoutEffect(
//     () => {
//       const outer =
//         outerRef.current;

//       const track =
//         trackRef.current;

//       if (
//         !outer ||
//         !track ||
//         !images.length
//       ) {
//         return;
//       }

//       const isMobile =
//         window.innerWidth <
//         MOBILE_BREAKPOINT;

//       const isTablet =
//         window.innerWidth >=
//           MOBILE_BREAKPOINT &&
//         window.innerWidth <
//           TABLET_BREAKPOINT;

//       const ctx =
//         gsap.context(() => {
//           const getTravel =
//             () => {
//               return Math.max(
//                 0,
//                 track.scrollWidth -
//                   window.innerWidth
//               );
//             };

//           /*
//            * Main horizontal animation.
//            */
//           const horizontalTween =
//             gsap.to(track, {
//               x: () =>
//                 -getTravel(),

//               ease: "none",

//               scrollTrigger: {
//                 trigger: outer,

//                 start: "top top",

//                 end: () =>
//                   `+=${getTravel()}`,

//                 scrub: reducedMotion
//                   ? true
//                   : scrollSmoothing,

//                 invalidateOnRefresh:
//                   true,

//                 anticipatePin: 1,

//                 onUpdate: () => {
//                   /*
//                    * Find the card which is
//                    * actually closest to viewport
//                    * center.
//                    */
//                   const viewportCenter =
//                     window.innerWidth /
//                     2;

//                   let closest =
//                     0;

//                   let closestDistance =
//                     Infinity;

//                   wrappersRef.current.forEach(
//                     (
//                       wrapper,
//                       index
//                     ) => {
//                       if (!wrapper) {
//                         return;
//                       }

//                       const rect =
//                         wrapper.getBoundingClientRect();

//                       const cardCenter =
//                         rect.left +
//                         rect.width /
//                           2;

//                       const distance =
//                         Math.abs(
//                           cardCenter -
//                             viewportCenter
//                         );

//                       if (
//                         distance <
//                         closestDistance
//                       ) {
//                         closestDistance =
//                           distance;

//                         closest =
//                           index;
//                       }
//                     }
//                   );

//                   setActiveIndex(
//                     closest
//                   );
//                 },
//               },
//             });

//           horizontalTweenRef.current =
//             horizontalTween;

//           /* ===============================================
//              CARD ROTATION
//           =============================================== */

//           cardsRef.current.forEach(
//             (
//               card,
//               index
//             ) => {
//               const wrapper =
//                 wrappersRef.current[
//                   index
//                 ];

//               if (
//                 !card ||
//                 !wrapper
//               ) {
//                 return;
//               }

//               const total =
//                 images.length;

//               const mid =
//                 Math.floor(
//                   total / 2
//                 );

//               const step =
//                 (isMobile
//                   ? MOBILE_STEP
//                   : isTablet
//                     ? TABLET_STEP
//                     : DESKTOP_STEP) *
//                 verticalDrift;

//               let offset;

//               if (index < mid) {
//                 offset =
//                   -(
//                     (mid - index) *
//                     step
//                   );
//               } else {
//                 offset =
//                   (index -
//                     mid +
//                     1) *
//                   step;
//               }

//               const rotationScale =
//                 reducedMotion
//                   ? ROTATION_REDUCTION_FACTOR
//                   : 1;

//               const rotateX =
//                 (offset < 0
//                   ? ROTATE_X_NEGATIVE
//                   : ROTATE_X_POSITIVE) *
//                 rotationScale;

//               const rotateIn =
//                 (isMobile
//                   ? MOBILE_ROTATE_IN
//                   : isTablet
//                     ? TABLET_ROTATE_IN
//                     : DESKTOP_ROTATE_IN) *
//                 rotationScale *
//                 rotationAmount;

//               const rotateOut =
//                 (isMobile
//                   ? MOBILE_ROTATE_OUT
//                   : isTablet
//                     ? TABLET_ROTATE_OUT
//                     : DESKTOP_ROTATE_OUT) *
//                 rotationScale *
//                 rotationAmount;

//               const timeline =
//                 gsap.timeline({
//                   scrollTrigger: {
//                     trigger:
//                       wrapper,

//                     containerAnimation:
//                       horizontalTween,

//                     start:
//                       "left 100%",

//                     end:
//                       "right 0%",

//                     scrub: true,

//                     invalidateOnRefresh:
//                       true,
//                   },
//                 });

//               timeline
//                 .fromTo(
//                   card,
//                   {
//                     rotateY:
//                       rotateIn,

//                     rotateX,

//                     opacity: 0.8,

//                     y: `${offset}vh`,
//                   },
//                   {
//                     rotateY: 0,

//                     rotateX: 0,

//                     opacity: 1,

//                     y: 0,

//                     ease: "none",
//                   }
//                 )
//                 .to(card, {
//                   rotateY:
//                     rotateOut,

//                   opacity: 0.9,

//                   y: `${-offset}vh`,

//                   ease: "none",
//                 });
//             }
//           );

//           /*
//            * Wait until browser has calculated
//            * actual card dimensions.
//            */
//           requestAnimationFrame(() => {
//             ScrollTrigger.refresh();
//           });
//         }, outer);

//       return () => {
//         horizontalTweenRef.current =
//           null;

//         ctx.revert();
//       };
//     },
//     [
//       images,
//       rotationAmount,
//       verticalDrift,
//       scrollSmoothing,
//       reducedMotion,
//     ]
//   );

//   /* =======================================================
//      CENTER SLIDE

//      THIS IS THE IMPORTANT FIX.

//      We calculate using the CURRENT rendered
//      bounding rectangle instead of offsetLeft.
//   ======================================================= */

//   const centerSlide =
//     useCallback(
//       (index) => {
//         const wrapper =
//           wrappersRef.current[index];

//         const outer =
//           outerRef.current;

//         if (
//           !wrapper ||
//           !outer
//         ) {
//           return;
//         }

//         /*
//          * Refresh dimensions before calculating.
//          */
//         ScrollTrigger.refresh();

//         const rect =
//           wrapper.getBoundingClientRect();

//         const viewportCenter =
//           window.innerWidth / 2;

//         const cardCenter =
//           rect.left +
//           rect.width / 2;

//         /*
//          * Current difference between
//          * card center and viewport center.
//          */
//         const delta =
//           cardCenter -
//           viewportCenter;

//         if (
//           Math.abs(delta) < 1
//         ) {
//           setActiveIndex(index);
//           return;
//         }

//         const st =
//           horizontalTweenRef
//             .current
//             ?.scrollTrigger;

//         if (!st) {
//           return;
//         }

//         /*
//          * Current horizontal position
//          * of the ScrollTrigger.
//          */
//         const currentScroll =
//           window.scrollY;

//         /*
//          * Because one vertical pixel
//          * corresponds to one horizontal
//          * pixel in our ScrollTrigger setup,
//          * move by the exact difference.
//          */
//         const targetScroll =
//           currentScroll + delta;

//         const minScroll =
//           st.start;

//         const maxScroll =
//           st.end;

//         const clampedTarget =
//           Math.max(
//             minScroll,
//             Math.min(
//               maxScroll,
//               targetScroll
//             )
//           );

//         setActiveIndex(index);

//         /*
//          * Stop navigation animation
//          * from fighting with itself.
//          */
//         if (
//           navigationTweenRef.current
//         ) {
//           navigationTweenRef.current.kill();
//         }

//         if (reducedMotion) {
//           window.scrollTo({
//             top: clampedTarget,
//             behavior: "auto",
//           });

//           return;
//         }

//         const state = {
//           value: currentScroll,
//         };

//         navigationTweenRef.current =
//           gsap.to(state, {
//             value: clampedTarget,

//             duration: 0.8,

//             ease:
//               "power3.inOut",

//             overwrite: true,

//             onUpdate: () => {
//               window.scrollTo(
//                 0,
//                 state.value
//               );
//             },

//             onComplete: () => {
//               window.scrollTo(
//                 0,
//                 clampedTarget
//               );

//               setActiveIndex(
//                 index
//               );
//             },
//           });
//       },
//       [reducedMotion]
//     );

//   /* =======================================================
//      NEXT
//   ======================================================= */

//   const nextSlide =
//     useCallback(() => {
//       if (!images.length) {
//         return;
//       }

//       const next =
//         activeIndex >=
//         images.length - 1
//           ? 0
//           : activeIndex + 1;

//       centerSlide(next);
//     }, [
//       activeIndex,
//       images.length,
//       centerSlide,
//     ]);

//   /* =======================================================
//      PREVIOUS
//   ======================================================= */

//   const previousSlide =
//     useCallback(() => {
//       if (!images.length) {
//         return;
//       }

//       const previous =
//         activeIndex <= 0
//           ? images.length - 1
//           : activeIndex - 1;

//       centerSlide(previous);
//     }, [
//       activeIndex,
//       images.length,
//       centerSlide,
//     ]);

//   /* =======================================================
//      CLICK OUTSIDE / CARD CLICK
//   ======================================================= */

//   const handleCardClick =
//     useCallback(
//       (index) => {
//         centerSlide(index);
//       },
//       [centerSlide]
//     );

//   /* =======================================================
//      KEYBOARD
//   ======================================================= */

//   useEffect(() => {
//     const handleKeyDown =
//       (event) => {
//         if (
//           event.key ===
//           "ArrowRight"
//         ) {
//           event.preventDefault();

//           nextSlide();
//         }

//         if (
//           event.key ===
//           "ArrowLeft"
//         ) {
//           event.preventDefault();

//           previousSlide();
//         }
//       };

//     window.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     return () => {
//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//     };
//   }, [
//     nextSlide,
//     previousSlide,
//   ]);

//   /* =======================================================
//      CLEANUP
//   ======================================================= */

//   useEffect(() => {
//     return () => {
//       if (
//         navigationTweenRef.current
//       ) {
//         navigationTweenRef.current.kill();
//       }

//       videosRef.current.forEach(
//         (video) => {
//           if (video) {
//             video.pause();
//           }
//         }
//       );
//     };
//   }, []);

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   if (!images.length) {
//     return null;
//   }

//   return (
//     <section
//       ref={outerRef}
//       className="
//         relative
//         w-full
//         bg-white
//       "
//     >
//       <div
//         className="
//           sticky
//           top-0
//           flex
//           h-screen
//           w-full
//           items-center
//           overflow-hidden
//         "
//         style={{
//           perspective: reducedMotion
//             ? REDUCED_PERSPECTIVE
//             : `${perspective}px`,
//         }}
//       >
//         {/* =================================================
//             TRACK
//         ================================================= */}

//         <div
//           ref={trackRef}
//           className="
//             flex
//             h-full
//             items-center
//             will-change-transform

//             gap-[5vw]

//             pl-[31vw]
//             pr-[31vw]

//             max-[1025px]:gap-[8vw]
//             max-[1025px]:pl-[22vw]
//             max-[1025px]:pr-[22vw]

//             max-md:gap-[8vw]
//             max-md:pl-[12.5vw]
//             max-md:pr-[12.5vw]
//           "
//           style={{
//             transformStyle:
//               "preserve-3d",
//           }}
//         >
//           {images.map(
//             (media, index) => (
//               <div
//                 key={`${media?.src || media}-${index}`}
//                 ref={(element) => {
//                   wrappersRef.current[
//                     index
//                   ] = element;
//                 }}
//                 onClick={() =>
//                   handleCardClick(
//                     index
//                   )
//                 }
//                 className="
//                   relative
//                   flex
//                   h-[45vh]
//                   w-[38vw]
//                   shrink-0
//                   cursor-pointer
//                   items-center
//                   justify-center

//                   max-[1025px]:h-[40vh]
//                   max-[1025px]:w-[55vw]

//                   max-md:h-[35vh]
//                   max-md:w-[75vw]
//                 "
//                 style={{
//                   transformStyle:
//                     "preserve-3d",
//                 }}
//               >
//                 <RotationCard
//                   ref={(element) => {
//                     cardsRef.current[
//                       index
//                     ] = element;
//                   }}
//                   media={media}
//                   index={index}
//                   total={images.length}
//                   showCaptions={
//                     showCaptions
//                   }
//                   textColor={
//                     textColor
//                   }
//                   videoMuted={
//                     videoMuted
//                   }
//                   videoLoop={
//                     videoLoop
//                   }
//                   videoPlaysInline={
//                     videoPlaysInline
//                   }
//                   isActive={
//                     activeIndex ===
//                     index
//                   }
//                   isPlaying={
//                     playingIndex ===
//                     index
//                   }
//                   onRegisterVideo={
//                     registerVideo
//                   }
//                   onToggleVideo={
//                     toggleVideo
//                   }
//                 />
//               </div>
//             )
//           )}
//         </div>

//         {/* =================================================
//             PREVIOUS
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Previous slide"
//           onClick={(event) => {
//             event.stopPropagation();

//             previousSlide();
//           }}
//           className="
//             absolute
//             left-4
//             top-1/2
//             z-[200]
//             flex
//             h-11
//             w-11
//             -translate-y-1/2
//             items-center
//             justify-center
//             rounded-full

//             border
//             border-black/10

//             bg-white/95
//             text-black

//             shadow-[0_10px_35px_rgba(0,0,0,0.15)]

//             backdrop-blur-md

//             transition-all
//             duration-300

//             hover:scale-110
//             hover:bg-white

//             active:scale-95

//             sm:left-6
//             sm:h-12
//             sm:w-12

//             md:left-8
//             md:h-13
//             md:w-13

//             lg:left-10
//             lg:h-14
//             lg:w-14
//           "
//         >
//           <ChevronLeft
//             className="
//               h-5
//               w-5
//               md:h-6
//               md:w-6
//             "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//             NEXT
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Next slide"
//           onClick={(event) => {
//             event.stopPropagation();

//             nextSlide();
//           }}
//           className="
//             absolute
//             right-4
//             top-1/2
//             z-[200]
//             flex
//             h-11
//             w-11
//             -translate-y-1/2
//             items-center
//             justify-center
//             rounded-full

//             border
//             border-black/10

//             bg-white/95
//             text-black

//             shadow-[0_10px_35px_rgba(0,0,0,0.15)]

//             backdrop-blur-md

//             transition-all
//             duration-300

//             hover:scale-110
//             hover:bg-white

//             active:scale-95

//             sm:right-6
//             sm:h-12
//             sm:w-12

//             md:right-8
//             md:h-13
//             md:w-13

//             lg:right-10
//             lg:h-14
//             lg:w-14
//           "
//         >
//           <ChevronRight
//             className="
//               h-5
//               w-5
//               md:h-6
//               md:w-6
//             "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//             COUNTER
//         ================================================= */}

//         <div
//           className="
//             pointer-events-none
//             absolute
//             bottom-5
//             left-1/2
//             z-[200]
//             -translate-x-1/2

//             rounded-full

//             bg-black/60

//             px-3
//             py-1.5

//             text-[10px]
//             font-medium
//             tracking-[0.12em]

//             text-white

//             backdrop-blur-md
//           "
//         >
//           {String(
//             activeIndex + 1
//           ).padStart(2, "0")}{" "}
//           /{" "}
//           {String(
//             images.length
//           ).padStart(2, "0")}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    ROTATION CARD
// ========================================================= */

// const RotationCard = forwardRef(
//   (
//     {
//       media,

//       index,

//       total,

//       showCaptions,

//       textColor,

//       videoMuted,

//       videoLoop,

//       videoPlaysInline,

//       isActive,

//       isPlaying,

//       onRegisterVideo,

//       onToggleVideo,
//     },
//     ref
//   ) => {
//     const videoRef =
//       useRef(null);

//     const cursorRef =
//       useRef(null);

//     const animationRef =
//       useRef(null);

//     const targetX =
//       useRef(0);

//     const targetY =
//       useRef(0);

//     const currentX =
//       useRef(0);

//     const currentY =
//       useRef(0);

//     const [hovered, setHovered] =
//       useState(false);

//     const src =
//       typeof media === "string"
//         ? media
//         : media?.src;

//     const type =
//       typeof media ===
//         "object" &&
//       media?.type
//         ? media.type
//         : isVideoSource(src)
//           ? "video"
//           : "image";

//     const caption =
//       typeof media === "object"
//         ? media.text
//         : "";

//     const poster =
//       typeof media === "object"
//         ? media.poster
//         : undefined;

//     /* =====================================================
//        REGISTER VIDEO
//     ===================================================== */

//     useEffect(() => {
//       if (type !== "video") {
//         return;
//       }

//       onRegisterVideo(
//         index,
//         videoRef.current
//       );

//       return () => {
//         onRegisterVideo(
//           index,
//           null
//         );
//       };
//     }, [
//       type,
//       index,
//       onRegisterVideo,
//     ]);

//     /* =====================================================
//        LERP CURSOR
//     ===================================================== */

//     useEffect(() => {
//       if (type !== "video") {
//         return;
//       }

//       const animate = () => {
//         currentX.current +=
//           (targetX.current -
//             currentX.current) *
//           0.15;

//         currentY.current +=
//           (targetY.current -
//             currentY.current) *
//           0.15;

//         if (cursorRef.current) {
//           cursorRef.current.style.transform =
//             `translate3d(${currentX.current}px, ${currentY.current}px, 0) translate(-50%, -50%)`;
//         }

//         animationRef.current =
//           requestAnimationFrame(
//             animate
//           );
//       };

//       animationRef.current =
//         requestAnimationFrame(
//           animate
//         );

//       return () => {
//         if (
//           animationRef.current
//         ) {
//           cancelAnimationFrame(
//             animationRef.current
//           );
//         }
//       };
//     }, [type]);

//     /* =====================================================
//        MOUSE MOVE
//     ===================================================== */

//     const handleMouseMove = (
//       event
//     ) => {
//       if (type !== "video") {
//         return;
//       }

//       const rect =
//         event.currentTarget.getBoundingClientRect();

//       targetX.current =
//         event.clientX -
//         rect.left;

//       targetY.current =
//         event.clientY -
//         rect.top;
//     };

//     /* =====================================================
//        MOUSE ENTER
//     ===================================================== */

//     const handleMouseEnter = (
//       event
//     ) => {
//       if (type !== "video") {
//         return;
//       }

//       const rect =
//         event.currentTarget.getBoundingClientRect();

//       const x =
//         event.clientX -
//         rect.left;

//       const y =
//         event.clientY -
//         rect.top;

//       currentX.current = x;
//       currentY.current = y;

//       targetX.current = x;
//       targetY.current = y;

//       setHovered(true);
//     };

//     /* =====================================================
//        MOUSE LEAVE
//     ===================================================== */

//     const handleMouseLeave = () => {
//       if (type !== "video") {
//         return;
//       }

//       setHovered(false);
//     };

//     /* =====================================================
//        VIDEO CLICK

//        STOP PROPAGATION!

//        Otherwise the parent card will also
//        receive the click and try to navigate.
//     ===================================================== */

//     const handleVideoClick = (
//       event
//     ) => {
//       event.preventDefault();

//       event.stopPropagation();

//       onToggleVideo(index);
//     };

//     return (
//       <div
//         ref={ref}
//         className={`
//           absolute

//           h-[45vh]
//           w-[38vw]

//           origin-right

//           overflow-hidden

//           rounded-[5px]

//           opacity-0

//           max-[1025px]:h-[40vh]
//           max-[1025px]:w-[50vw]

//           max-md:h-[35vh]
//           max-md:w-[75vw]

//           ${
//             isActive
//               ? "shadow-[0_25px_80px_rgba(0,0,0,0.22)]"
//               : ""
//           }
//         `}
//         style={{
//           transformStyle:
//             "preserve-3d",

//           zIndex:
//             total - index,
//         }}
//       >
//         {/* =================================================
//             MEDIA
//         ================================================= */}

//         <div
//           className="
//             relative
//             h-full
//             w-full
//             overflow-hidden
//             bg-black
//           "
//           onMouseEnter={
//             type === "video"
//               ? handleMouseEnter
//               : undefined
//           }
//           onMouseMove={
//             type === "video"
//               ? handleMouseMove
//               : undefined
//           }
//           onMouseLeave={
//             type === "video"
//               ? handleMouseLeave
//               : undefined
//           }
//         >
//           {type === "video" ? (
//             <>
//               <video
//                 ref={videoRef}
//                 src={src}
//                 poster={poster}

//                 /*
//                  * IMPORTANT:
//                  *
//                  * Muted by default makes
//                  * browser playback much more
//                  * reliable.
//                  *
//                  * If you need sound, change
//                  * videoMuted={false}.
//                  */
//                 muted={
//                   media?.muted ??
//                   videoMuted
//                 }

//                 autoPlay={false}

//                 loop={
//                   media?.loop ??
//                   videoLoop
//                 }

//                 playsInline={
//                   media?.playsInline ??
//                   videoPlaysInline
//                 }

//                 preload="auto"

//                 controls={false}

//                 onPlay={() => {
//                   /*
//                    * React state is updated
//                    * by parent toggle.
//                    */
//                 }}

//                 onPause={() => {
//                   /*
//                    * Don't blindly clear playingIndex
//                    * here because another video may
//                    * immediately start.
//                    */
//                 }}

//                 className="
//                   absolute
//                   inset-0
//                   h-full
//                   w-full
//                   select-none
//                   object-cover
//                 "
//               />

//               {/* =========================================
//                   DESKTOP CUSTOM CURSOR
//               ========================================= */}

//               <div
//                 ref={cursorRef}
//                 className={`
//                   pointer-events-none

//                   absolute
//                   left-0
//                   top-0

//                   z-30

//                   hidden

//                   h-14
//                   w-14

//                   items-center
//                   justify-center

//                   rounded-full

//                   border
//                   border-white/50

//                   bg-black/30

//                   text-white

//                   shadow-[0_10px_40px_rgba(0,0,0,0.3)]

//                   backdrop-blur-md

//                   transition-[opacity,scale]
//                   duration-300

//                   md:flex

//                   ${
//                     hovered
//                       ? "scale-100 opacity-100"
//                       : "scale-75 opacity-0"
//                   }
//                 `}
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                       h-5
//                       w-5
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                       ml-0.5
//                       h-5
//                       w-5
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </div>

//               {/* =========================================
//                   MOBILE PLAY BUTTON
//               ========================================= */}

//               <button
//                 type="button"
//                 aria-label={
//                   isPlaying
//                     ? "Pause video"
//                     : "Play video"
//                 }
//                 onClick={
//                   handleVideoClick
//                 }
//                 className="
//                   absolute
//                   bottom-3
//                   left-1/2

//                   z-40

//                   flex
//                   h-11
//                   w-11

//                   -translate-x-1/2

//                   items-center
//                   justify-center

//                   rounded-full

//                   border
//                   border-white/30

//                   bg-black/60

//                   text-white

//                   shadow-xl

//                   backdrop-blur-md

//                   active:scale-90

//                   md:hidden
//                 "
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                       h-4
//                       w-4
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                       ml-0.5
//                       h-4
//                       w-4
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </button>

//               {/* =========================================
//                   DESKTOP CLICK LAYER

//                   This makes clicking anywhere
//                   on the video toggle playback.
//               ========================================= */}

//               <button
//                 type="button"
//                 aria-label={
//                   isPlaying
//                     ? "Pause video"
//                     : "Play video"
//                 }
//                 onClick={
//                   handleVideoClick
//                 }
//                 className="
//                   absolute
//                   inset-0
//                   z-20

//                   hidden

//                   cursor-none

//                   md:block
//                 "
//               />
//             </>
//           ) : (
//             <img
//               src={src}
//               alt={
//                 media?.alt ||
//                 `Slide ${index + 1}`
//               }
//               draggable={false}
//               className="
//                 absolute
//                 inset-0
//                 h-full
//                 w-full
//                 select-none
//                 object-cover
//               "
//             />
//           )}
//         </div>

//         {/* =================================================
//             CAPTION
//         ================================================= */}

//         {showCaptions &&
//           caption && (
//             <div
//               className="
//                 pointer-events-none

//                 absolute

//                 left-1/2
//                 top-1/2

//                 z-10

//                 -translate-x-1/2
//                 -translate-y-1/2

//                 whitespace-nowrap

//                 text-center

//                 text-[1.4vw]

//                 font-medium

//                 max-[1025px]:text-[2.4vw]

//                 max-md:text-[4vw]
//               "
//               style={{
//                 color: textColor,

//                 textShadow:
//                   "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
//               }}
//             >
//               {caption}
//             </div>
//           )}
//       </div>
//     );
//   }
// );

// RotationCard.displayName =
//   "RotationCard";

// "use client";

// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";

// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// /* =========================================================
// BREAKPOINTS
// ========================================================= */

// const MOBILE_BREAKPOINT = 640;
// const TABLET_BREAKPOINT = 1025;

// /* =========================================================
// ROTATION SETTINGS
// ========================================================= */

// const MOBILE_STEP = 2;
// const TABLET_STEP = 6;
// const DESKTOP_STEP = 10;

// const MOBILE_ROTATE_IN = -60;
// const TABLET_ROTATE_IN = -80;
// const DESKTOP_ROTATE_IN = -100;

// const MOBILE_ROTATE_OUT = 50;
// const TABLET_ROTATE_OUT = 65;
// const DESKTOP_ROTATE_OUT = 80;

// const ROTATE_X_NEGATIVE = 5;
// const ROTATE_X_POSITIVE = -5;

// const REDUCED_PERSPECTIVE = "4800px";

// /* =========================================================
// REDUCED MOTION
// ========================================================= */

// function prefersReducedMotion() {
//   if (typeof window === "undefined") {
//     return false;
//   }

//   return (
//     window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
//   );
// }

// /* =========================================================
// VIDEO DETECTION
// ========================================================= */

// function isVideoSource(src = "") {
//   return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(src);
// }
// /* =========================================================
// MAIN COMPONENT
// ========================================================= */

// export function RotationSliderComp({
//   images = [],

//   rotationAmount = 1,

//   verticalDrift = 1,

//   scrollSmoothing = 1,

//   perspective = 1200,

//   showCaptions = true,

//   textColor = "#ffffff",

//   videoMuted = true,

//   videoLoop = true,

//   videoPlaysInline = true,
// }) {
//   const outerRef = useRef(null);

//   const trackRef = useRef(null);

//   const cardsRef = useRef([]);

//   const wrappersRef = useRef([]);

//   const videosRef = useRef([]);

//   const horizontalTweenRef = useRef(null);

//   const navigationTweenRef = useRef(null);

//   const reducedMotion = prefersReducedMotion();

//   const [activeIndex, setActiveIndex] = useState(0);

//   const [playingIndex, setPlayingIndex] = useState(null);

//   /* =======================================================
// REGISTER VIDEO
// ======================================================= */

//   const registerVideo = useCallback((index, video) => {
//     videosRef.current[index] = video;
//   }, []);

//   /* =======================================================
// STOP OTHER VIDEOS
// ======================================================= */

//   const stopOtherVideos = useCallback((exceptIndex) => {
//     videosRef.current.forEach((video, index) => {
//       if (video && index !== exceptIndex) {
//         video.pause();
//       }
//     });
//   }, []);

//   /* =======================================================
// PLAY VIDEO
// ======================================================= */

//   const playVideo = useCallback(
//     async (index) => {
//       const video = videosRef.current[index];

//       if (!video) {
//         return;
//       }

//       stopOtherVideos(index);

//       try {
//         video.muted = false;
//         video.volume = 1;
//         video.playsInline = true;

//         await video.play();

//         setPlayingIndex(index);
//       } catch (error) {
//         console.warn(
//           "Audio playback blocked. Falling back to muted playback.",
//           error,
//         );

//         try {
//           video.muted = true;

//           await video.play();

//           setPlayingIndex(index);
//         } catch (fallbackError) {
//           console.error("Video playback failed:", fallbackError);

//           setPlayingIndex(null);
//         }
//       }
//     },
//     [stopOtherVideos],
//   );

//   /* =======================================================
// PAUSE VIDEO
// ======================================================= */

//   const pauseVideo = useCallback((index) => {
//     const video = videosRef.current[index];

//     if (!video) {
//       return;
//     }

//     video.pause();

//     setPlayingIndex((current) => (current === index ? null : current));
//   }, []);

//   /* =======================================================
// TOGGLE VIDEO
// ======================================================= */

//   const toggleVideo = useCallback(
//     (index) => {
//       const video = videosRef.current[index];

//       if (!video) {
//         return;
//       }

//       if (video.paused) {
//         playVideo(index);
//       } else {
//         pauseVideo(index);
//       }
//     },
//     [playVideo, pauseVideo],
//   );

//   /* =======================================================
// INITIAL VIDEO STATE
// ======================================================= */

//   useEffect(() => {
//     videosRef.current.forEach((video) => {
//       if (!video) {
//         return;
//       }

//       video.pause();

//       video.muted = true;

//       video.volume = 1;

//       video.playsInline = true;
//     });

//     setPlayingIndex(null);
//   }, [images]);

//   /* =======================================================
// SECTION HEIGHT
// ======================================================= */

//   useEffect(() => {
//     const outer = outerRef.current;

//     const track = trackRef.current;

//     if (!outer || !track) {
//       return;
//     }

//     const updateHeight = () => {
//       const travel = Math.max(0, track.scrollWidth - window.innerWidth);

//       outer.style.height = `${travel + window.innerHeight}px`;
//     };

//     updateHeight();

//     const resizeObserver = new ResizeObserver(updateHeight);

//     resizeObserver.observe(track);

//     window.addEventListener("resize", updateHeight);

//     return () => {
//       resizeObserver.disconnect();

//       window.removeEventListener("resize", updateHeight);
//     };
//   }, [images]);

//   /* =======================================================
// GSAP HORIZONTAL SCROLL
// ======================================================= */

//   useLayoutEffect(() => {
//     const outer = outerRef.current;

//     const track = trackRef.current;

//     if (!outer || !track || !images.length) {
//       return;
//     }

//     const context = gsap.context(() => {
//       const getTravel = () =>
//         Math.max(0, track.scrollWidth - window.innerWidth);

//       /* ===============================================
//        HORIZONTAL TRACK
//     =============================================== */

//       const horizontalTween = gsap.to(track, {
//         x: () => -getTravel(),

//         ease: "none",

//         scrollTrigger: {
//           trigger: outer,

//           start: "top top",

//           end: () => `+=${getTravel()}`,

//           scrub: reducedMotion ? true : scrollSmoothing,

//           invalidateOnRefresh: true,

//           onUpdate: () => {
//             const viewportCenter = window.innerWidth / 2;

//             let closestIndex = 0;

//             let closestDistance = Infinity;

//             wrappersRef.current.forEach((wrapper, index) => {
//               if (!wrapper) {
//                 return;
//               }

//               const rect = wrapper.getBoundingClientRect();

//               const slideCenter = rect.left + rect.width / 2;

//               const distance = Math.abs(slideCenter - viewportCenter);

//               if (distance < closestDistance) {
//                 closestDistance = distance;

//                 closestIndex = index;
//               }
//             });

//             setActiveIndex(closestIndex);
//           },
//         },
//       });

//       horizontalTweenRef.current = horizontalTween;

//       /* ===============================================
//        CARD ROTATIONS
//     =============================================== */

//       const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

//       const isTablet =
//         window.innerWidth >= MOBILE_BREAKPOINT &&
//         window.innerWidth < TABLET_BREAKPOINT;

//       cardsRef.current.forEach((card, index) => {
//         const wrapper = wrappersRef.current[index];

//         if (!card || !wrapper) {
//           return;
//         }

//         const total = images.length;

//         const mid = Math.floor(total / 2);

//         const step =
//           (isMobile ? MOBILE_STEP : isTablet ? TABLET_STEP : DESKTOP_STEP) *
//           verticalDrift;

//         let offset;

//         if (index < mid) {
//           offset = -((mid - index) * step);
//         } else {
//           offset = (index - mid + 1) * step;
//         }

//         const rotationScale = reducedMotion ? 0.15 : 1;

//         const rotateXValue =
//           (offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE) * rotationScale;

//         const rotateInValue =
//           (isMobile
//             ? MOBILE_ROTATE_IN
//             : isTablet
//               ? TABLET_ROTATE_IN
//               : DESKTOP_ROTATE_IN) *
//           rotationScale *
//           rotationAmount;

//         const rotateOutValue =
//           (isMobile
//             ? MOBILE_ROTATE_OUT
//             : isTablet
//               ? TABLET_ROTATE_OUT
//               : DESKTOP_ROTATE_OUT) *
//           rotationScale *
//           rotationAmount;

//         const timeline = gsap.timeline({
//           scrollTrigger: {
//             trigger: wrapper,

//             containerAnimation: horizontalTween,

//             start: "left 100%",

//             end: "right 0%",

//             scrub: true,

//             invalidateOnRefresh: true,
//           },
//         });

//         timeline
//           .fromTo(
//             card,
//             {
//               rotateY: rotateInValue,

//               rotateX: rotateXValue,

//               opacity: 0.8,

//               y: `${offset}vh`,
//             },
//             {
//               rotateY: 0,

//               rotateX: 0,

//               opacity: 1,

//               y: 0,

//               ease: "none",
//             },
//           )
//           .to(card, {
//             rotateY: rotateOutValue,

//             opacity: 0.9,

//             y: `${-offset}vh`,

//             ease: "none",
//           });
//       });

//       requestAnimationFrame(() => {
//         ScrollTrigger.refresh();
//       });
//     }, outer);

//     return () => {
//       navigationTweenRef.current?.kill();

//       horizontalTweenRef.current = null;

//       context.revert();
//     };
//   }, [images, rotationAmount, verticalDrift, scrollSmoothing, reducedMotion]);

//   /* =======================================================
// CENTER SLIDE
// ======================================================= */

//   const centerSlide = useCallback(
//     (index) => {
//       const wrapper = wrappersRef.current[index];

//       const horizontalTween = horizontalTweenRef.current;

//       const scrollTrigger = horizontalTween?.scrollTrigger;

//       if (!wrapper || !scrollTrigger) {
//         return;
//       }

//       const rect = wrapper.getBoundingClientRect();

//       const slideCenter = rect.left + rect.width / 2;

//       const viewportCenter = window.innerWidth / 2;

//       const difference = slideCenter - viewportCenter;

//       const currentScroll = window.scrollY;

//       let targetScroll = currentScroll + difference;

//       targetScroll = Math.max(
//         scrollTrigger.start,
//         Math.min(scrollTrigger.end, targetScroll),
//       );

//       setActiveIndex(index);

//       navigationTweenRef.current?.kill();

//       if (reducedMotion) {
//         window.scrollTo({
//           top: targetScroll,
//           behavior: "auto",
//         });

//         ScrollTrigger.update();

//         return;
//       }

//       navigationTweenRef.current = gsap.to(window, {
//         duration: 0.8,

//         ease: "power3.inOut",

//         scrollTo: {
//           y: targetScroll,

//           autoKill: false,
//         },

//         overwrite: true,

//         onComplete: () => {
//           setActiveIndex(index);

//           ScrollTrigger.update();

//           /*
//            * Refresh cursor/card positions
//            * after navigation finishes.
//            */
//           window.dispatchEvent(
//             new MouseEvent("mousemove", {
//               clientX: window.__rotationMouseX ?? 0,

//               clientY: window.__rotationMouseY ?? 0,
//             }),
//           );
//         },
//       });
//     },
//     [reducedMotion],
//   );

//   /* =======================================================
// NEXT
// ======================================================= */

//   const nextSlide = useCallback(() => {
//     if (!images.length) {
//       return;
//     }

//     const next = activeIndex < images.length - 1 ? activeIndex + 1 : 0;

//     centerSlide(next);
//   }, [activeIndex, images.length, centerSlide]);

//   /* =======================================================
// PREVIOUS
// ======================================================= */

//   const previousSlide = useCallback(() => {
//     if (!images.length) {
//       return;
//     }

//     const previous = activeIndex > 0 ? activeIndex - 1 : images.length - 1;

//     centerSlide(previous);
//   }, [activeIndex, images.length, centerSlide]);

//   /* =======================================================
// IMAGE CLICK
// ======================================================= */

//   const handleImageClick = useCallback(
//     (index) => {
//       centerSlide(index);
//     },
//     [centerSlide],
//   );

//   /* =======================================================
// VIDEO CLICK
// ======================================================= */

//   const handleVideoClick = useCallback(
//     (index) => {
//       centerSlide(index);

//       const video = videosRef.current[index];

//       if (!video) {
//         return;
//       }

//       if (video.paused) {
//         playVideo(index);
//       } else {
//         pauseVideo(index);
//       }
//     },
//     [centerSlide, playVideo, pauseVideo],
//   );

//   /* =======================================================
// KEYBOARD
// ======================================================= */

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "ArrowLeft") {
//         previousSlide();
//       }

//       if (event.key === "ArrowRight") {
//         nextSlide();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [previousSlide, nextSlide]);

//   /* =======================================================
// GLOBAL MOUSE POSITION

//  This is used by RotationCard so that
//  cards can detect the cursor even when
//  GSAP moves the card underneath a
//  stationary mouse.

// ======================================================= */

//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       window.__rotationMouseX = event.clientX;

//       window.__rotationMouseY = event.clientY;
//     };

//     window.addEventListener("mousemove", handleMouseMove, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   /* =======================================================
// CLEANUP
// ======================================================= */

//   useEffect(() => {
//     return () => {
//       navigationTweenRef.current?.kill();

//       videosRef.current.forEach((video) => {
//         if (video) {
//           video.pause();
//         }
//       });

//       delete window.__rotationMouseX;
//       delete window.__rotationMouseY;
//     };
//   }, []);

//   /* =======================================================
// EMPTY
// ======================================================= */

//   if (!images.length) {
//     return null;
//   }

//   /* =======================================================
// JSX
// ======================================================= */

//   return (
//     <section
//       ref={outerRef}
//       className="relative w-full bg-white
//    "
//     >
//       <div
//         className="sticky top-0 flex h-screen w-full items-center overflow-hidden
// "
//         style={{
//           perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px`,
//         }}
//       >
//         {/* =================================================
// HORIZONTAL TRACK
// ================================================= */}

//         <div
//           ref={trackRef}
//           className="flex h-full items-center gap-[5vw] pl-[31vw] pr-[31vw] will-change-transform max-[1025px]:gap-[8vw] max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw] max-md:gap-[8vw] max-md:pl-[12.5vw] max-md:pr-[12.5vw]
//       "
//           style={{
//             transformStyle: "preserve-3d",
//           }}
//         >
//           {images.map((item, index) => (
//             <div
//               key={`${item?.src || item}-${index}`}
//               ref={(element) => {
//                 wrappersRef.current[index] = element;
//               }}
//               className="relative flex shrink-0 h-[45vh] w-[38vw] items-center justify-center max-[1025px]:h-[40vh] max-[1025px]:w-[55vw] max-md:h-[35vh] max-md:w-[75vw]
//             "
//               style={{
//                 transformStyle: "preserve-3d",
//               }}
//             >
//               <RotationCard
//                 ref={(element) => {
//                   cardsRef.current[index] = element;
//                 }}
//                 item={item}
//                 index={index}
//                 total={images.length}
//                 isActive={activeIndex === index}
//                 isPlaying={playingIndex === index}
//                 showCaptions={showCaptions}
//                 textColor={textColor}
//                 videoMuted={videoMuted}
//                 videoLoop={videoLoop}
//                 videoPlaysInline={videoPlaysInline}
//                 onRegisterVideo={registerVideo}
//                 onImageClick={handleImageClick}
//                 onVideoClick={handleVideoClick}
//               />
//             </div>
//           ))}
//         </div>

//         {/* =================================================
//         PREVIOUS BUTTON
//     ================================================= */}

//         <button
//           type="button"
//           aria-label="Previous slide"
//           onClick={(event) => {
//             event.preventDefault();
//             event.stopPropagation();

//             previousSlide();
//           }}
//           className="
//         absolute
//         left-4
//         top-1/2
//         z-[9999]
//         flex
//         h-11
//         w-11
//         -translate-y-1/2
//         cursor-pointer
//         touch-manipulation
//         items-center
//         justify-center
//         rounded-full
//         bg-white
//         text-black
//         shadow-xl
//         transition-all
//         duration-300
//         hover:scale-110
//         active:scale-90
//         sm:left-6
//         sm:h-12
//         sm:w-12
//         lg:left-10
//       "
//         >
//           <ChevronLeft
//             className="
//           h-5
//           w-5
//           sm:h-6
//           sm:w-6
//         "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//         NEXT BUTTON
//     ================================================= */}

//         <button
//           type="button"
//           aria-label="Next slide"
//           onClick={(event) => {
//             event.preventDefault();
//             event.stopPropagation();

//             nextSlide();
//           }}
//           className="
//         absolute
//         right-4
//         top-1/2
//         z-[9999]
//         flex
//         h-11
//         w-11
//         -translate-y-1/2
//         cursor-pointer
//         touch-manipulation
//         items-center
//         justify-center
//         rounded-full
//         bg-white
//         text-black
//         shadow-xl
//         transition-all
//         duration-300
//         hover:scale-110
//         active:scale-90
//         sm:right-6
//         sm:h-12
//         sm:w-12
//         lg:right-10
//       "
//         >
//           <ChevronRight
//             className="
//           h-5
//           w-5
//           sm:h-6
//           sm:w-6
//         "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//         COUNTER
//     ================================================= */}

//         <div
//           className="
//         pointer-events-none
//         absolute
//         bottom-5
//         left-1/2
//         z-[9999]
//         -translate-x-1/2
//         rounded-full
//         bg-black/60
//         px-3
//         py-1.5
//         text-[10px]
//         tracking-[0.12em]
//         text-white
//         backdrop-blur-md
//       "
//         >
//           {String(activeIndex + 1).padStart(2, "0")} /{" "}
//           {String(images.length).padStart(2, "0")}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
// ROTATION CARD
// ========================================================= */

// const RotationCard = forwardRef(
//   (
//     {
//       item,
//       index,
//       total,

//       isActive,
//       isPlaying,

//       showCaptions,

//       textColor,

//       videoMuted,
//       videoLoop,
//       videoPlaysInline,

//       onRegisterVideo,

//       onImageClick,

//       onVideoClick,
//     },
//     ref,
//   ) => {
//     const videoRef = useRef(null);

//     /* =====================================================
//    CUSTOM CURSOR
// ===================================================== */

//     const cursorRef = useRef(null);

//     const animationRef = useRef(null);

//     const targetX = useRef(0);

//     const targetY = useRef(0);

//     const currentX = useRef(0);

//     const currentY = useRef(0);

//     const isHoveredRef = useRef(false);

//     const [isHovered, setIsHovered] = useState(false);

//     /* =====================================================
//    DATA
// ===================================================== */

//     const src = typeof item === "string" ? item : item?.src;

//     const caption = typeof item === "object" ? item?.text : "";

//     const mediaType =
//       typeof item === "object" && item?.type
//         ? item.type
//         : isVideoSource(src)
//           ? "video"
//           : "image";

//     const isVideo = mediaType === "video";

//     /* =====================================================
//    REGISTER VIDEO
// ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       onRegisterVideo(index, videoRef.current);

//       return () => {
//         onRegisterVideo(index, null);
//       };
//     }, [index, isVideo, onRegisterVideo]);

//     /* =====================================================
//    VIDEO INITIAL STATE
// ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       const video = videoRef.current;

//       if (!video) {
//         return;
//       }

//       video.pause();

//       video.muted = true;

//       video.volume = 1;

//       video.playsInline = true;
//     }, [isVideo]);

//     /* =====================================================
//    CUSTOM CURSOR LERP

//    Cursor is rendered inside the card.

//    IMPORTANT:
//    pointer-events-none means the cursor
//    can NEVER interfere with the video.
// ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       const animateCursor = () => {
//         currentX.current += (targetX.current - currentX.current) * 0.12;

//         currentY.current += (targetY.current - currentY.current) * 0.12;

//         if (cursorRef.current) {
//           cursorRef.current.style.transform = `translate3d(
//           ${currentX.current}px,
//           ${currentY.current}px,
//           0
//         ) translate(-50%, -50%)`;
//         }

//         animationRef.current = requestAnimationFrame(animateCursor);
//       };

//       animationRef.current = requestAnimationFrame(animateCursor);

//       return () => {
//         if (animationRef.current) {
//           cancelAnimationFrame(animationRef.current);
//         }
//       };
//     }, [isVideo]);

//     /* =====================================================
//    GLOBAL CURSOR DETECTION

//    THIS IS THE IMPORTANT FIX.

//    We do NOT rely on mouseenter.

//    If GSAP moves the card underneath
//    a stationary mouse, getBoundingClientRect()
//    will detect that the mouse is now inside
//    the card.
// ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       const mediaElement = document.querySelector(
//         `[data-rotation-video="${index}"]`,
//       );

//       if (!mediaElement) {
//         return;
//       }

//       const handleGlobalMouseMove = (event) => {
//         const rect = mediaElement.getBoundingClientRect();

//         const isInside =
//           event.clientX >= rect.left &&
//           event.clientX <= rect.right &&
//           event.clientY >= rect.top &&
//           event.clientY <= rect.bottom;

//         if (isInside) {
//           const x = event.clientX - rect.left;

//           const y = event.clientY - rect.top;

//           targetX.current = x;

//           targetY.current = y;

//           /*
//            * When card suddenly comes
//            * underneath stationary mouse,
//            * immediately place cursor there.
//            */
//           if (!isHoveredRef.current) {
//             currentX.current = x;
//             currentY.current = y;

//             isHoveredRef.current = true;

//             setIsHovered(true);
//           }
//         } else {
//           if (isHoveredRef.current) {
//             isHoveredRef.current = false;

//             setIsHovered(false);
//           }
//         }
//       };

//       window.addEventListener("mousemove", handleGlobalMouseMove, {
//         passive: true,
//       });

//       return () => {
//         window.removeEventListener("mousemove", handleGlobalMouseMove);

//         isHoveredRef.current = false;
//       };
//     }, [isVideo, index]);

//     /* =====================================================
//    EXTRA CHECK AFTER SCROLL

//    This fixes the exact situation where
//    the card moves under a stationary mouse
//    without mousemove firing.
// ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       let frameId = null;

//       const checkCursorPosition = () => {
//         const mediaElement = document.querySelector(
//           `[data-rotation-video="${index}"]`,
//         );

//         const mouseX = window.__rotationMouseX;

//         const mouseY = window.__rotationMouseY;

//         if (
//           !mediaElement ||
//           typeof mouseX !== "number" ||
//           typeof mouseY !== "number"
//         ) {
//           frameId = requestAnimationFrame(checkCursorPosition);

//           return;
//         }

//         const rect = mediaElement.getBoundingClientRect();

//         const isInside =
//           mouseX >= rect.left &&
//           mouseX <= rect.right &&
//           mouseY >= rect.top &&
//           mouseY <= rect.bottom;

//         if (isInside) {
//           const x = mouseX - rect.left;

//           const y = mouseY - rect.top;

//           targetX.current = x;

//           targetY.current = y;

//           if (!isHoveredRef.current) {
//             currentX.current = x;
//             currentY.current = y;

//             isHoveredRef.current = true;

//             setIsHovered(true);
//           }
//         } else {
//           if (isHoveredRef.current) {
//             isHoveredRef.current = false;

//             setIsHovered(false);
//           }
//         }

//         frameId = requestAnimationFrame(checkCursorPosition);
//       };

//       frameId = requestAnimationFrame(checkCursorPosition);

//       return () => {
//         if (frameId) {
//           cancelAnimationFrame(frameId);
//         }
//       };
//     }, [isVideo, index]);

//     /* =====================================================
//    IMAGE CLICK
// ===================================================== */

//     const handleImageClick = (event) => {
//       event.preventDefault();

//       event.stopPropagation();

//       onImageClick(index);
//     };

//     /* =====================================================
//    VIDEO CLICK
// ===================================================== */

//     const handleVideoClick = (event) => {
//       event.preventDefault();

//       event.stopPropagation();

//       onVideoClick(index);
//     };

//     /* =====================================================
//    RENDER
// ===================================================== */

//     return (
//       <div
//         ref={ref}
//         className="
//       absolute
//       h-[45vh]
//       w-[38vw]
//       origin-right
//       overflow-hidden
//       rounded-[5px]
//       bg-black
//       opacity-0
//       max-[1025px]:h-[40vh]
//       max-[1025px]:w-[50vw]
//       max-md:h-[35vh]
//       max-md:w-[75vw]
//     "
//         style={{
//           transformStyle: "preserve-3d",
//           zIndex: isActive ? 1000 : 100 + (total - index),
//         }}
//       >
//         {/* =================================================
//         MEDIA CONTAINER
//     ================================================= */}

//         <div
//           data-rotation-video={isVideo ? index : undefined}
//           className="
//         relative
//         h-full
//         w-full
//         overflow-hidden
//       "
//         >
//           {/* ===============================================
//           VIDEO
//       =============================================== */}

//           {isVideo ? (
//             <>
//               <video
//                 ref={videoRef}
//                 src={src}
//                 muted={true}
//                 loop={item?.loop ?? videoLoop}
//                 playsInline={item?.playsInline ?? videoPlaysInline}
//                 preload="metadata"
//                 className="
//               absolute
//               inset-0
//               h-full
//               w-full
//               cursor-none
//               select-none
//               object-cover
//               touch-manipulation
//               pointer-events-auto
//             "
//                 onClick={handleVideoClick}
//               />

//               {/* =========================================
//               DESKTOP CUSTOM CURSOR
//           ========================================= */}

//               <div
//                 ref={cursorRef}
//                 className={`
//     pointer-events-none
//     absolute
//     left-0
//     top-0
//     z-[100]
//     hidden
//     h-14
//     w-14
//     items-center
//     justify-center
//     rounded-full
//     border
//     border-white/70
//     bg-black/30
//     text-white
//     backdrop-blur-md
//     transition-opacity
//     duration-200
//     md:flex
//     ${isHovered ? "opacity-100" : "opacity-0"}
//   `}
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                   h-5
//                   w-5
//                   fill-white
//                 "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                   ml-0.5
//                   h-5
//                   w-5
//                   fill-white
//                 "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </div>

//               {/* =========================================
//               MOBILE PLAY / PAUSE
//           ========================================= */}

//               <button
//                 type="button"
//                 aria-label={isPlaying ? "Pause video" : "Play video"}
//                 onClick={handleVideoClick}
//                 className="
//               absolute
//               bottom-4
//               left-1/2
//               z-[200]
//               flex
//               h-12
//               w-12
//               -translate-x-1/2
//               touch-manipulation
//               items-center
//               justify-center
//               rounded-full
//               border
//               border-white/30
//               bg-black/70
//               text-white
//               shadow-xl
//               backdrop-blur-md
//               transition-transform
//               active:scale-90
//               md:hidden
//             "
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                   h-4
//                   w-4
//                   fill-white
//                 "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                   ml-0.5
//                   h-4
//                   w-4
//                   fill-white
//                 "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </button>
//             </>
//           ) : (
//             /* =============================================
//            IMAGE
//         ============================================= */

//             <img
//               src={src}
//               alt={item?.alt || `Slide ${index + 1}`}
//               draggable={false}
//               onClick={handleImageClick}
//               className="
//             absolute
//             inset-0
//             h-full
//             w-full
//             cursor-pointer
//             select-none
//             object-cover
//             touch-manipulation
//             transition-transform
//             duration-700
//           "
//             />
//           )}
//         </div>

//         {/* =================================================
//         CAPTION
//     ================================================= */}

//         {showCaptions && caption && (
//           <div
//             className="
//             pointer-events-none
//             absolute
//             left-1/2
//             top-1/2
//             z-[50]
//             -translate-x-1/2
//             -translate-y-1/2
//             whitespace-nowrap
//             text-center
//             text-[1.4vw]
//             font-medium
//             max-[1025px]:text-[2.4vw]
//             max-md:text-[4vw]
//           "
//             style={{
//               color: textColor,

//               textShadow:
//                 "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
//             }}
//           >
//             {caption}
//           </div>
//         )}
//       </div>
//     );
//   },
// );

// RotationCard.displayName = "RotationCard";

// "use client";

// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";

// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// /* =========================================================
// BREAKPOINTS
// ========================================================= */

// const MOBILE_BREAKPOINT = 640;
// const TABLET_BREAKPOINT = 1025;

// /* =========================================================
// ROTATION SETTINGS
// ========================================================= */

// const MOBILE_STEP = 2;
// const TABLET_STEP = 6;
// const DESKTOP_STEP = 10;

// const MOBILE_ROTATE_IN = -60;
// const TABLET_ROTATE_IN = -80;
// const DESKTOP_ROTATE_IN = -100;

// const MOBILE_ROTATE_OUT = 50;
// const TABLET_ROTATE_OUT = 65;
// const DESKTOP_ROTATE_OUT = 80;

// const ROTATE_X_NEGATIVE = 5;
// const ROTATE_X_POSITIVE = -5;

// const REDUCED_PERSPECTIVE = "4800px";

// /* =========================================================
// REDUCED MOTION
// ========================================================= */

// function prefersReducedMotion() {
//   if (typeof window === "undefined") {
//     return false;
//   }

//   return (
//     window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
//   );
// }

// /* =========================================================
// VIDEO DETECTION
// ========================================================= */

// function isVideoSource(src = "") {
//   return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(src);
// }

// /* =========================================================
// MAIN COMPONENT
// ========================================================= */

// export function RotationSliderComp({
//   images = [],

//   rotationAmount = 1,

//   verticalDrift = 1,

//   scrollSmoothing = 1,

//   perspective = 1200,

//   showCaptions = true,

//   textColor = "#ffffff",

//   videoMuted = true,

//   videoLoop = true,

//   videoPlaysInline = true,
// }) {
//   const outerRef = useRef(null);

//   const trackRef = useRef(null);

//   const cardsRef = useRef([]);

//   const wrappersRef = useRef([]);

//   /*
//    * CHANGED:
//    *
//    * Videos are now stored using item.id.
//    *
//    * videosRef.current[id] = video
//    */
//   const videosRef = useRef({});

//   const horizontalTweenRef = useRef(null);

//   const navigationTweenRef = useRef(null);

//   const reducedMotion = prefersReducedMotion();

//   /*
//    * CHANGED:
//    *
//    * Active item is identified by ID.
//    */
//   const [activeId, setActiveId] = useState(images[0]?.id ?? null);

//   /*
//    * CHANGED:
//    *
//    * Playing item is identified by ID.
//    */
//   const [playingId, setPlayingId] = useState(null);

//   /* =======================================================
//   REGISTER VIDEO
//   ======================================================= */

//   const registerVideo = useCallback((id, video) => {
//     videosRef.current[id] = video;
//   }, []);

//   /* =======================================================
//   STOP OTHER VIDEOS
//   ======================================================= */

//   const stopOtherVideos = useCallback((exceptId) => {
//     Object.entries(videosRef.current).forEach(([id, video]) => {
//       if (video && String(id) !== String(exceptId)) {
//         video.pause();
//       }
//     });
//   }, []);

//   /* =======================================================
//   PLAY VIDEO
//   ======================================================= */

//   const playVideo = useCallback(
//     async (id) => {
//       const video = videosRef.current[id];

//       if (!video) {
//         return;
//       }

//       stopOtherVideos(id);

//       try {
//         video.muted = false;

//         video.volume = 1;

//         video.playsInline = true;

//         await video.play();

//         setPlayingId(id);
//       } catch (error) {
//         console.warn(
//           "Audio playback blocked. Falling back to muted playback.",
//           error,
//         );

//         try {
//           video.muted = true;

//           await video.play();

//           setPlayingId(id);
//         } catch (fallbackError) {
//           console.error("Video playback failed:", fallbackError);

//           setPlayingId(null);
//         }
//       }
//     },
//     [stopOtherVideos],
//   );

//   /* =======================================================
//   PAUSE VIDEO
//   ======================================================= */

//   const pauseVideo = useCallback((id) => {
//     const video = videosRef.current[id];

//     if (!video) {
//       return;
//     }

//     video.pause();

//     setPlayingId((current) =>
//       String(current) === String(id) ? null : current,
//     );
//   }, []);

//   /* =======================================================
//   TOGGLE VIDEO
//   ======================================================= */

//   const toggleVideo = useCallback(
//     (id) => {
//       const video = videosRef.current[id];

//       if (!video) {
//         return;
//       }

//       if (video.paused) {
//         playVideo(id);
//       } else {
//         pauseVideo(id);
//       }
//     },
//     [playVideo, pauseVideo],
//   );

//   /* =======================================================
//   INITIAL VIDEO STATE
//   ======================================================= */

//   useEffect(() => {
//     Object.values(videosRef.current).forEach((video) => {
//       if (!video) {
//         return;
//       }

//       video.pause();

//       video.muted = true;

//       video.volume = 1;

//       video.playsInline = true;
//     });

//     setPlayingId(null);
//   }, [images]);

//   /* =======================================================
//   SECTION HEIGHT
//   ======================================================= */

//   useEffect(() => {
//     const outer = outerRef.current;

//     const track = trackRef.current;

//     if (!outer || !track) {
//       return;
//     }

//     const updateHeight = () => {
//       const travel = Math.max(0, track.scrollWidth - window.innerWidth);

//       outer.style.height = `${travel + window.innerHeight}px`;
//     };

//     updateHeight();

//     const resizeObserver = new ResizeObserver(updateHeight);

//     resizeObserver.observe(track);

//     window.addEventListener("resize", updateHeight);

//     return () => {
//       resizeObserver.disconnect();

//       window.removeEventListener("resize", updateHeight);
//     };
//   }, [images]);

//   /* =======================================================
//   GSAP HORIZONTAL SCROLL
//   ======================================================= */

//   useLayoutEffect(() => {
//     const outer = outerRef.current;

//     const track = trackRef.current;

//     if (!outer || !track || !images.length) {
//       return;
//     }

//     const context = gsap.context(() => {
//       const getTravel = () =>
//         Math.max(0, track.scrollWidth - window.innerWidth);

//       /* ===============================================
//         HORIZONTAL TRACK
//         =============================================== */

//       const horizontalTween = gsap.to(track, {
//         x: () => -getTravel(),

//         ease: "none",

//         scrollTrigger: {
//           trigger: outer,

//           start: "top top",

//           end: () => `+=${getTravel()}`,

//           scrub: reducedMotion ? true : scrollSmoothing,

//           invalidateOnRefresh: true,

//           onUpdate: () => {
//             const viewportCenter = window.innerWidth / 2;

//             let closestIndex = 0;

//             let closestDistance = Infinity;

//             wrappersRef.current.forEach((wrapper, index) => {
//               if (!wrapper) {
//                 return;
//               }

//               const rect = wrapper.getBoundingClientRect();

//               const slideCenter = rect.left + rect.width / 2;

//               const distance = Math.abs(slideCenter - viewportCenter);

//               if (distance < closestDistance) {
//                 closestDistance = distance;

//                 closestIndex = index;
//               }
//             });

//             /*
//              * IMPORTANT:
//              *
//              * index is only used to
//              * find the item in the
//              * current array order.
//              *
//              * Identity is item.id.
//              */

//             const activeItem = images[closestIndex];

//             if (activeItem) {
//               setActiveId(activeItem.id);
//             }
//           },
//         },
//       });

//       horizontalTweenRef.current = horizontalTween;

//       /* ===============================================
//         CARD ROTATIONS
//         =============================================== */

//       const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

//       const isTablet =
//         window.innerWidth >= MOBILE_BREAKPOINT &&
//         window.innerWidth < TABLET_BREAKPOINT;

//       cardsRef.current.forEach((card, index) => {
//         const wrapper = wrappersRef.current[index];

//         if (!card || !wrapper) {
//           return;
//         }

//         const total = images.length;

//         const mid = Math.floor(total / 2);

//         const step =
//           (isMobile ? MOBILE_STEP : isTablet ? TABLET_STEP : DESKTOP_STEP) *
//           verticalDrift;

//         let offset;

//         if (index < mid) {
//           offset = -((mid - index) * step);
//         } else {
//           offset = (index - mid + 1) * step;
//         }

//         const rotationScale = reducedMotion ? 0.15 : 1;

//         const rotateXValue =
//           (offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE) * rotationScale;

//         const rotateInValue =
//           (isMobile
//             ? MOBILE_ROTATE_IN
//             : isTablet
//               ? TABLET_ROTATE_IN
//               : DESKTOP_ROTATE_IN) *
//           rotationScale *
//           rotationAmount;

//         const rotateOutValue =
//           (isMobile
//             ? MOBILE_ROTATE_OUT
//             : isTablet
//               ? TABLET_ROTATE_OUT
//               : DESKTOP_ROTATE_OUT) *
//           rotationScale *
//           rotationAmount;

//         const timeline = gsap.timeline({
//           scrollTrigger: {
//             trigger: wrapper,

//             containerAnimation: horizontalTween,

//             start: "left 100%",

//             end: "right 0%",

//             scrub: true,

//             invalidateOnRefresh: true,
//           },
//         });

//         timeline
//           .fromTo(
//             card,
//             {
//               rotateY: rotateInValue,

//               rotateX: rotateXValue,

//               opacity: 0.8,

//               y: `${offset}vh`,
//             },
//             {
//               rotateY: 0,

//               rotateX: 0,

//               opacity: 1,

//               y: 0,

//               ease: "none",
//             },
//           )
//           .to(card, {
//             rotateY: rotateOutValue,

//             opacity: 0.9,

//             y: `${-offset}vh`,

//             ease: "none",
//           });
//       });

//       requestAnimationFrame(() => {
//         ScrollTrigger.refresh();
//       });
//     }, outer);

//     return () => {
//       navigationTweenRef.current?.kill();

//       horizontalTweenRef.current = null;

//       context.revert();
//     };
//   }, [images, rotationAmount, verticalDrift, scrollSmoothing, reducedMotion]);

//   /* =======================================================
//   CENTER SLIDE
//   ======================================================= */

//   const centerSlide = useCallback(
//     (id) => {
//       /*
//        * ID is now used to find the
//        * physical position in the array.
//        *
//        * index is only used internally
//        * for wrappersRef.
//        */

//       const index = images.findIndex((item) => String(item?.id) === String(id));

//       if (index === -1) {
//         return;
//       }

//       const wrapper = wrappersRef.current[index];

//       const horizontalTween = horizontalTweenRef.current;

//       const scrollTrigger = horizontalTween?.scrollTrigger;

//       if (!wrapper || !scrollTrigger) {
//         return;
//       }

//       const rect = wrapper.getBoundingClientRect();

//       const slideCenter = rect.left + rect.width / 2;

//       const viewportCenter = window.innerWidth / 2;

//       const difference = slideCenter - viewportCenter;

//       const currentScroll = window.scrollY;

//       let targetScroll = currentScroll + difference;

//       targetScroll = Math.max(
//         scrollTrigger.start,
//         Math.min(scrollTrigger.end, targetScroll),
//       );

//       /*
//        * ID-based active state.
//        */
//       setActiveId(id);

//       navigationTweenRef.current?.kill();

//       if (reducedMotion) {
//         window.scrollTo({
//           top: targetScroll,

//           behavior: "auto",
//         });

//         ScrollTrigger.update();

//         return;
//       }

//       navigationTweenRef.current = gsap.to(window, {
//         duration: 0.8,

//         ease: "power3.inOut",

//         scrollTo: {
//           y: targetScroll,

//           autoKill: false,
//         },

//         overwrite: true,

//         onComplete: () => {
//           setActiveId(id);

//           ScrollTrigger.update();

//           /*
//            * Refresh cursor/card positions
//            * after navigation finishes.
//            */

//           window.dispatchEvent(
//             new MouseEvent("mousemove", {
//               clientX: window.__rotationMouseX ?? 0,

//               clientY: window.__rotationMouseY ?? 0,
//             }),
//           );
//         },
//       });
//     },
//     [images, reducedMotion],
//   );

//   /* =======================================================
//   NEXT
//   ======================================================= */

//   const nextSlide = useCallback(() => {
//     if (!images.length) {
//       return;
//     }

//     /*
//      * Find current position by ID.
//      */
//     const activeIndex = images.findIndex(
//       (item) => String(item?.id) === String(activeId),
//     );

//     const safeIndex = activeIndex === -1 ? 0 : activeIndex;

//     const next = safeIndex < images.length - 1 ? safeIndex + 1 : 0;

//     const nextItem = images[next];

//     if (nextItem) {
//       centerSlide(nextItem.id);
//     }
//   }, [activeId, images, centerSlide]);

//   /* =======================================================
//   PREVIOUS
//   ======================================================= */

//   const previousSlide = useCallback(() => {
//     if (!images.length) {
//       return;
//     }

//     /*
//      * Find current position by ID.
//      */
//     const activeIndex = images.findIndex(
//       (item) => String(item?.id) === String(activeId),
//     );

//     const safeIndex = activeIndex === -1 ? 0 : activeIndex;

//     const previous = safeIndex > 0 ? safeIndex - 1 : images.length - 1;

//     const previousItem = images[previous];

//     if (previousItem) {
//       centerSlide(previousItem.id);
//     }
//   }, [activeId, images, centerSlide]);

//   /* =======================================================
//   IMAGE CLICK
//   ======================================================= */

//   const handleImageClick = useCallback(
//     (id) => {
//       centerSlide(id);
//     },
//     [centerSlide],
//   );

//   /* =======================================================
//   VIDEO CLICK
//   ======================================================= */

//   const handleVideoClick = useCallback(
//     (id) => {
//       /*
//        * Center using ID.
//        */
//       centerSlide(id);

//       /*
//        * Get video using ID.
//        */
//       const video = videosRef.current[id];

//       if (!video) {
//         return;
//       }

//       if (video.paused) {
//         playVideo(id);
//       } else {
//         pauseVideo(id);
//       }
//     },
//     [centerSlide, playVideo, pauseVideo],
//   );

//   /* =======================================================
//   KEYBOARD
//   ======================================================= */

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "ArrowLeft") {
//         previousSlide();
//       }

//       if (event.key === "ArrowRight") {
//         nextSlide();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [previousSlide, nextSlide]);

//   /* =======================================================
//   GLOBAL MOUSE POSITION

//   This is used by RotationCard so that
//   cards can detect the cursor even when
//   GSAP moves the card underneath a
//   stationary mouse.
//   ======================================================= */

//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       window.__rotationMouseX = event.clientX;

//       window.__rotationMouseY = event.clientY;
//     };

//     window.addEventListener("mousemove", handleMouseMove, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   /* =======================================================
//   CLEANUP
//   ======================================================= */

//   useEffect(() => {
//     return () => {
//       navigationTweenRef.current?.kill();

//       Object.values(videosRef.current).forEach((video) => {
//         if (video) {
//           video.pause();
//         }
//       });

//       delete window.__rotationMouseX;

//       delete window.__rotationMouseY;
//     };
//   }, []);

//   /* =======================================================
//   EMPTY
//   ======================================================= */

//   if (!images.length) {
//     return null;
//   }

//   /* =======================================================
//   JSX
//   ======================================================= */

//   return (
//     <section
//       ref={outerRef}
//       className="relative w-full bg-red-500
//       "
//     >
//       <div
//         className="sticky top-0 flex h-screen w-full items-center overflow-hidden
//         "
//         style={{
//           perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px`,
//         }}
//       >
//         {/* =================================================
//         HORIZONTAL TRACK
//         ================================================= */}

//         {/* <div
//           ref={trackRef}
//           className="flex h-full items-center gap-[5vw] pl-[31vw] pr-[31vw] will-change-transform max-[1025px]:gap-[8vw] max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw] max-md:gap-[8vw] max-md:pl-[12.5vw] max-md:pr-[12.5vw] bg-yellow-500
//           "
//           style={{
//             transformStyle:
//               "preserve-3d",
//           }}
//         > */}
//         <div
//           ref={trackRef}
//           className="pointer-events-none flex h-full items-center gap-[5vw] pl-[31vw] pr-[31vw] will-change-transform max-[1025px]:gap-[8vw] max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw] max-md:gap-[8vw] max-md:pl-[12.5vw] max-md:pr-[12.5vw]"
//           style={{
//             transformStyle:
//               "preserve-3d",
//           }}
//         >
//           {images.map((item, index) => (
//             <div
//               /*
//                * CHANGED:
//                * React identity is item.id.
//                */
//               key={item?.id}
//               ref={(element) => {
//                 wrappersRef.current[index] = element;
//               }}
//                className="pointer-events-none relative flex shrink-0 h-[45vh] w-[38vw] items-center justify-center max-[1025px]:h-[40vh] max-[1025px]:w-[55vw] max-md:h-[35vh] max-md:w-[75vw]"
//               style={{
//                 transformStyle: "preserve-3d",
//               }}
//             >
//               <RotationCard
//                 ref={(element) => {
//                   cardsRef.current[index] = element;
//                 }}
//                 item={item}
//                 index={index}
//                 total={images.length}
//                 /*
//                  * CHANGED:
//                  * Active state uses ID.
//                  */
//                 isActive={String(activeId) === String(item?.id)}
//                 /*
//                  * CHANGED:
//                  * Playing state uses ID.
//                  */
//                 isPlaying={String(playingId) === String(item?.id)}
//                 showCaptions={showCaptions}
//                 textColor={textColor}
//                 videoMuted={videoMuted}
//                 videoLoop={videoLoop}
//                 videoPlaysInline={videoPlaysInline}
//                 onRegisterVideo={registerVideo}
//                 onImageClick={handleImageClick}
//                 onVideoClick={handleVideoClick}
//               />
//             </div>
//           ))}
//         </div>

//         {/* =================================================
//         PREVIOUS BUTTON
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Previous slide"
//           onClick={(event) => {
//             event.preventDefault();

//             event.stopPropagation();

//             previousSlide();
//           }}
//           className="
//             absolute
//             left-4
//             top-1/2
//             z-[9999]
//             flex
//             h-11
//             w-11
//             -translate-y-1/2
//             cursor-pointer
//             touch-manipulation
//             items-center
//             justify-center
//             rounded-full
//             bg-white
//             text-black
//             shadow-xl
//             transition-all
//             duration-300
//             hover:scale-110
//             active:scale-90
//             sm:left-6
//             sm:h-12
//             sm:w-12
//             lg:left-10
//           "
//         >
//           <ChevronLeft
//             className="
//               h-5
//               w-5
//               sm:h-6
//               sm:w-6
//             "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//         NEXT BUTTON
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Next slide"
//           onClick={(event) => {
//             event.preventDefault();

//             event.stopPropagation();

//             nextSlide();
//           }}
//           className="
//             absolute
//             right-4
//             top-1/2
//             z-[9999]
//             flex
//             h-11
//             w-11
//             -translate-y-1/2
//             cursor-pointer
//             touch-manipulation
//             items-center
//             justify-center
//             rounded-full
//             bg-white
//             text-black
//             shadow-xl
//             transition-all
//             duration-300
//             hover:scale-110
//             active:scale-90
//             sm:right-6
//             sm:h-12
//             sm:w-12
//             lg:right-10
//           "
//         >
//           <ChevronRight
//             className="
//               h-5
//               w-5
//               sm:h-6
//               sm:w-6
//             "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//         COUNTER
//         ================================================= */}

//         <div
//           className="
//             pointer-events-none
//             absolute
//             bottom-5
//             left-1/2
//             z-[9999]
//             -translate-x-1/2
//             rounded-full
//             bg-black/60
//             px-3
//             py-1.5
//             text-[10px]
//             tracking-[0.12em]
//             text-white
//             backdrop-blur-md
//           "
//         >
//           {String(
//             Math.max(
//               0,
//               images.findIndex((item) => String(item?.id) === String(activeId)),
//             ) + 1,
//           ).padStart(2, "0")}{" "}
//           / {String(images.length).padStart(2, "0")}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
// ROTATION CARD
// ========================================================= */

// const RotationCard = forwardRef(
//   (
//     {
//       item,

//       /*
//        * IMPORTANT:
//        *
//        * index is still here ONLY because
//        * GSAP needs the physical position.
//        *
//        * Identity is item.id.
//        */
//       index,

//       total,

//       isActive,

//       isPlaying,

//       showCaptions,

//       textColor,

//       videoMuted,

//       videoLoop,

//       videoPlaysInline,

//       onRegisterVideo,

//       onImageClick,

//       onVideoClick,
//     },
//     ref,
//   ) => {
//     const videoRef = useRef(null);

//     /* =====================================================
//     CUSTOM CURSOR
//     ===================================================== */

//     const cursorRef = useRef(null);

//     const animationRef = useRef(null);

//     const targetX = useRef(0);

//     const targetY = useRef(0);

//     const currentX = useRef(0);

//     const currentY = useRef(0);

//     const isHoveredRef = useRef(false);

//     const [isHovered, setIsHovered] = useState(false);

//     /* =====================================================
//     DATA
//     ===================================================== */

//     const src = typeof item === "string" ? item : item?.src;

//     const caption = typeof item === "object" ? item?.text : "";

//     const mediaType =
//       typeof item === "object" && item?.type
//         ? item.type
//         : isVideoSource(src)
//           ? "video"
//           : "image";

//     const isVideo = mediaType === "video";

//     /*
//      * CHANGED:
//      *
//      * ID comes from item.id.
//      */
//     const itemId = item?.id;

//     /* =====================================================
//     REGISTER VIDEO
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       /*
//        * CHANGED:
//        * Register video using ID.
//        */
//       onRegisterVideo(itemId, videoRef.current);

//       return () => {
//         onRegisterVideo(itemId, null);
//       };
//     }, [itemId, isVideo, onRegisterVideo]);

//     /* =====================================================
//     VIDEO INITIAL STATE
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       const video = videoRef.current;

//       if (!video) {
//         return;
//       }

//       video.pause();

//       video.muted = true;

//       video.volume = 1;

//       video.playsInline = true;
//     }, [isVideo]);

//     /* =====================================================
//     CUSTOM CURSOR LERP

//     Cursor is rendered inside the card.

//     IMPORTANT:
//     pointer-events-none means the cursor
//     can NEVER interfere with the video.
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       const animateCursor = () => {
//         currentX.current += (targetX.current - currentX.current) * 0.12;

//         currentY.current += (targetY.current - currentY.current) * 0.12;

//         if (cursorRef.current) {
//           cursorRef.current.style.transform = `translate3d(
//               ${currentX.current}px,
//               ${currentY.current}px,
//               0
//             ) translate(-50%, -50%)`;
//         }

//         animationRef.current = requestAnimationFrame(animateCursor);
//       };

//       animationRef.current = requestAnimationFrame(animateCursor);

//       return () => {
//         if (animationRef.current) {
//           cancelAnimationFrame(animationRef.current);
//         }
//       };
//     }, [isVideo]);

//     /* =====================================================
//     GLOBAL CURSOR DETECTION

//     THIS IS THE IMPORTANT FIX.

//     We do NOT rely on mouseenter.

//     If GSAP moves the card underneath
//     a stationary mouse, getBoundingClientRect()
//     will detect that the mouse is now inside
//     the card.

//     CHANGED:
//     The element is now found by item.id.
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       /*
//        * CHANGED:
//        *
//        * Use item.id instead of index.
//        */
//       const mediaElement = document.querySelector(
//         `[data-rotation-video="${itemId}"]`,
//       );

//       if (!mediaElement) {
//         return;
//       }

//       const handleGlobalMouseMove = (event) => {
//         const rect = mediaElement.getBoundingClientRect();

//         const isInside =
//           event.clientX >= rect.left &&
//           event.clientX <= rect.right &&
//           event.clientY >= rect.top &&
//           event.clientY <= rect.bottom;

//         if (isInside) {
//           const x = event.clientX - rect.left;

//           const y = event.clientY - rect.top;

//           targetX.current = x;

//           targetY.current = y;

//           /*
//            * When card suddenly comes
//            * underneath stationary mouse,
//            * immediately place cursor there.
//            */

//           if (!isHoveredRef.current) {
//             currentX.current = x;

//             currentY.current = y;

//             isHoveredRef.current = true;

//             setIsHovered(true);
//           }
//         } else {
//           if (isHoveredRef.current) {
//             isHoveredRef.current = false;

//             setIsHovered(false);
//           }
//         }
//       };

//       window.addEventListener("mousemove", handleGlobalMouseMove, {
//         passive: true,
//       });

//       return () => {
//         window.removeEventListener("mousemove", handleGlobalMouseMove);

//         isHoveredRef.current = false;
//       };
//     }, [isVideo, itemId]);

//     /* =====================================================
//     EXTRA CHECK AFTER SCROLL

//     This fixes the exact situation where
//     the card moves under a stationary mouse
//     without mousemove firing.

//     CHANGED:
//     Element is located by item.id.
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       let frameId = null;

//       const checkCursorPosition = () => {
//         /*
//          * CHANGED:
//          * ID instead of index.
//          */
//         const mediaElement = document.querySelector(
//           `[data-rotation-video="${itemId}"]`,
//         );

//         const mouseX = window.__rotationMouseX;

//         const mouseY = window.__rotationMouseY;

//         if (
//           !mediaElement ||
//           typeof mouseX !== "number" ||
//           typeof mouseY !== "number"
//         ) {
//           frameId = requestAnimationFrame(checkCursorPosition);

//           return;
//         }

//         const rect = mediaElement.getBoundingClientRect();

//         const isInside =
//           mouseX >= rect.left &&
//           mouseX <= rect.right &&
//           mouseY >= rect.top &&
//           mouseY <= rect.bottom;

//         if (isInside) {
//           const x = mouseX - rect.left;

//           const y = mouseY - rect.top;

//           targetX.current = x;

//           targetY.current = y;

//           if (!isHoveredRef.current) {
//             currentX.current = x;

//             currentY.current = y;

//             isHoveredRef.current = true;

//             setIsHovered(true);
//           }
//         } else {
//           if (isHoveredRef.current) {
//             isHoveredRef.current = false;

//             setIsHovered(false);
//           }
//         }

//         frameId = requestAnimationFrame(checkCursorPosition);
//       };

//       frameId = requestAnimationFrame(checkCursorPosition);

//       return () => {
//         if (frameId) {
//           cancelAnimationFrame(frameId);
//         }
//       };
//     }, [isVideo, itemId]);

//     /* =====================================================
//     IMAGE CLICK
//     ===================================================== */

//     const handleImageClick = (event) => {
//       event.preventDefault();

//       event.stopPropagation();

//       /*
//        * CHANGED:
//        * Send ID.
//        */
//       onImageClick(itemId);
//     };

//     /* =====================================================
//     VIDEO CLICK
//     ===================================================== */

//     const handleVideoClick = (event) => {
//       event.preventDefault();

//       event.stopPropagation();

//       /*
//        * CHANGED:
//        * Send ID.
//        */
//       onVideoClick(itemId);
//     };

//     /* =====================================================
//     RENDER
//     ===================================================== */

//     return (
//       <div
//         ref={ref}
//         className="
//         pointer-events-auto
//           absolute
//           h-[45vh]
//           w-[38vw]
//           origin-right
//           overflow-hidden
//           rounded-[5px]
//           bg-black
//           opacity-0
//           max-[1025px]:h-[40vh]
//           max-[1025px]:w-[50vw]
//           max-md:h-[35vh]
//           max-md:w-[75vw]
//         "
//         style={{
//           transformStyle: "preserve-3d",

//           /*
//            * IMPORTANT:
//            *
//            * z-index remains index based
//            * because this is visual/render order,
//            * NOT item identity.
//            */
//           zIndex: isActive ? 1000 : 100 + (total - index),
//         }}
//       >
//         {/* =================================================
//         MEDIA CONTAINER
//         ================================================= */}

//         <div
//           /*
//            * CHANGED:
//            *
//            * data attribute now uses ID.
//            */
//           data-rotation-video={isVideo ? itemId : undefined}
//           className="
//             relative
//             h-full
//             w-full
//             overflow-hidden
//           "
//         >
//           {/* ===============================================
//           VIDEO
//           =============================================== */}

//           {isVideo ? (
//             <>
//               <video
//                 ref={videoRef}
//                 src={src}
//                 muted={true}
//                 loop={item?.loop ?? videoLoop}
//                 playsInline={item?.playsInline ?? videoPlaysInline}
//                 preload="metadata"
//                 className="
//                   absolute
//                   inset-0
//                   h-full
//                   w-full
//                   cursor-none
//                   select-none
//                   object-cover
//                   touch-manipulation
//                   pointer-events-auto
//                 "
//                 onClick={handleVideoClick}
//               />

//               {/* =========================================
//               DESKTOP CUSTOM CURSOR
//               ========================================= */}

//               <div
//                 ref={cursorRef}
//                 className={`
//                   pointer-events-none
//                   absolute
//                   left-0
//                   top-0
//                   z-[100]
//                   hidden
//                   h-14
//                   w-14
//                   items-center
//                   justify-center
//                   rounded-full
//                   border
//                   border-white/70
//                   bg-black/30
//                   text-white
//                   backdrop-blur-md
//                   transition-opacity
//                   duration-200
//                   md:flex
//                   ${isHovered ? "opacity-100" : "opacity-0"}
//                 `}
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                       h-5
//                       w-5
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                       ml-0.5
//                       h-5
//                       w-5
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </div>

//               {/* =========================================
//               MOBILE PLAY / PAUSE
//               ========================================= */}

//               <button
//                 type="button"
//                 aria-label={isPlaying ? "Pause video" : "Play video"}
//                 onClick={handleVideoClick}
//                 className="
//                   absolute
//                   bottom-4
//                   left-1/2
//                   z-[200]
//                   flex
//                   h-12
//                   w-12
//                   -translate-x-1/2
//                   touch-manipulation
//                   items-center
//                   justify-center
//                   rounded-full
//                   border
//                   border-white/30
//                   bg-black/70
//                   text-white
//                   shadow-xl
//                   backdrop-blur-md
//                   transition-transform
//                   active:scale-90
//                   md:hidden
//                 "
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                       h-4
//                       w-4
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                       ml-0.5
//                       h-4
//                       w-4
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </button>
//             </>
//           ) : (
//             /* =============================================
//             IMAGE
//             ============================================= */

//             <img
//               src={src}
//               alt={item?.alt || `Slide ${index + 1}`}
//               draggable={false}
//               onClick={handleImageClick}
//               className="
//                 absolute
//                 inset-0
//                 h-full
//                 w-full
//                 cursor-pointer
//                 select-none
//                 object-cover
//                 touch-manipulation
//                 transition-transform
//                 duration-700
//               "
//             />
//           )}
//         </div>

//         {/* =================================================
//         CAPTION
//         ================================================= */}

//         {showCaptions && caption && (
//           <div
//             className="
//                 pointer-events-none
//                 absolute
//                 left-1/2
//                 top-1/2
//                 z-[50]
//                 -translate-x-1/2
//                 -translate-y-1/2
//                 whitespace-nowrap
//                 text-center
//                 text-[1.4vw]
//                 font-medium
//                 max-[1025px]:text-[2.4vw]
//                 max-md:text-[4vw]
//               "
//             style={{
//               color: textColor,

//               textShadow:
//                 "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
//             }}
//           >
//             {caption}
//           </div>
//         )}
//       </div>
//     );
//   },
// );

// RotationCard.displayName = "RotationCard";

// "use client";

// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";

// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
// // import PolishPerfectionSection from "@/components/PolishPerfectionSection";

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// /* =========================================================
// BREAKPOINTS
// ========================================================= */

// const MOBILE_BREAKPOINT = 640;
// const TABLET_BREAKPOINT = 1025;

// /* =========================================================
// ROTATION SETTINGS
// ========================================================= */

// const MOBILE_STEP = 2;
// const TABLET_STEP = 6;
// const DESKTOP_STEP = 10;

// const MOBILE_ROTATE_IN = -60;
// const TABLET_ROTATE_IN = -80;
// const DESKTOP_ROTATE_IN = -100;

// const MOBILE_ROTATE_OUT = 50;
// const TABLET_ROTATE_OUT = 65;
// const DESKTOP_ROTATE_OUT = 80;

// const ROTATE_X_NEGATIVE = 5;
// const ROTATE_X_POSITIVE = -5;

// const REDUCED_PERSPECTIVE = "4800px";

// /* =========================================================
// REDUCED MOTION
// ========================================================= */

// function prefersReducedMotion() {
//   if (typeof window === "undefined") {
//     return false;
//   }

//   return (
//     window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
//   );
// }

// /* =========================================================
// VIDEO DETECTION
// ========================================================= */

// function isVideoSource(src = "") {
//   return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(src);
// }

// /* =========================================================
// MAIN COMPONENT
// ========================================================= */

// export function RotationSliderComp({
//   images = [],

//   rotationAmount = 1,

//   verticalDrift = 1,

//   scrollSmoothing = 1,

//   perspective = 1200,

//   showCaptions = true,

//   textColor = "#ffffff",

//   videoMuted = true,

//   videoLoop = true,

//   videoPlaysInline = true,
// }) {
//   const outerRef = useRef(null);

//   const trackRef = useRef(null);

//   const cardsRef = useRef([]);

//   const wrappersRef = useRef([]);

//   /*
//    * CHANGED:
//    *
//    * Videos are now stored using item.id.
//    *
//    * videosRef.current[id] = video
//    */
//   const videosRef = useRef({});

//   // Tracks videos that have actually entered the mobile viewport.
//   // This prevents a video clicked from a side card from being
//   // immediately paused before it has a chance to reach center.
//   const mobileSeenVideoIdsRef = useRef(new Set());

//   const horizontalTweenRef = useRef(null);

//   const navigationTweenRef = useRef(null);

//   const reducedMotion = prefersReducedMotion();

//   /*
//    * CHANGED:
//    *
//    * Active item is identified by ID.
//    */
//   const [activeId, setActiveId] = useState(images[0]?.id ?? null);

//   /*
//    * CHANGED:
//    *
//    * Playing item is identified by ID.
//    */
//   const [playingId, setPlayingId] = useState(null);

//   // If a side video is clicked, keep the ID pending so playback
//   // starts automatically after the slide reaches the center.
//   const pendingVideoPlayIdRef = useRef(null);

//   // Tracks the previous center slide, especially for mobile
//   // where the old center video must stop immediately.
//   const previousActiveIdRef = useRef(images[0]?.id ?? null);

//   /* =======================================================
//   REGISTER VIDEO
//   ======================================================= */

//   const registerVideo = useCallback((id, video) => {
//     videosRef.current[id] = video;
//   }, []);

//   /* =======================================================
//   STOP OTHER VIDEOS
//   ======================================================= */

//   const stopOtherVideos = useCallback((exceptId) => {
//     Object.entries(videosRef.current).forEach(([id, video]) => {
//       if (video && String(id) !== String(exceptId)) {
//         video.pause();
//       }
//     });
//   }, []);

//   /* =======================================================
//   PLAY VIDEO
//   ======================================================= */

//   const playVideo = useCallback(
//     async (id) => {
//       const video = videosRef.current[id];

//       if (!video) {
//         return;
//       }

//       stopOtherVideos(id);

//       try {
//         video.muted = false;

//         video.volume = 1;

//         video.playsInline = true;

//         await video.play();

//         setPlayingId(id);
//       } catch (error) {
//         console.warn(
//           "Audio playback blocked. Falling back to muted playback.",
//           error,
//         );

//         try {
//           video.muted = true;

//           await video.play();

//           setPlayingId(id);
//         } catch (fallbackError) {
//           console.error("Video playback failed:", fallbackError);

//           setPlayingId(null);
//         }
//       }
//     },
//     [stopOtherVideos],
//   );

//   /* =======================================================
//   PAUSE VIDEO
//   ======================================================= */

//   const pauseVideo = useCallback((id) => {
//     const video = videosRef.current[id];

//     if (!video) {
//       return;
//     }

//     video.pause();

//     setPlayingId((current) =>
//       String(current) === String(id) ? null : current,
//     );
//   }, []);

//   /* =======================================================
//   TOGGLE VIDEO
//   ======================================================= */

//   const toggleVideo = useCallback(
//     (id) => {
//       const video = videosRef.current[id];

//       if (!video) {
//         return;
//       }

//       if (video.paused) {
//         playVideo(id);
//       } else {
//         pauseVideo(id);
//       }
//     },
//     [playVideo, pauseVideo],
//   );

//   /* =======================================================
//   INITIAL VIDEO STATE
//   ======================================================= */

//   useEffect(() => {
//     Object.values(videosRef.current).forEach((video) => {
//       if (!video) {
//         return;
//       }

//       video.pause();

//       video.muted = true;

//       video.volume = 1;

//       video.playsInline = true;
//     });

//     setPlayingId(null);
//     pendingVideoPlayIdRef.current = null;
//     previousActiveIdRef.current = images[0]?.id ?? null;
//   }, [images]);

//   /* =======================================================
//   AUTO PAUSE VIDEOS OUTSIDE THEIR ALLOWED AREA

//   Desktop / tablet:
//   - Only the center slide is allowed to keep playing.

//   Mobile:
//   - A video is also paused when it is completely outside
//     the viewport.
//   ======================================================= */

//   const pauseVideosOutsideAllowedArea = useCallback(
//     (centerId = null, pendingId = null) => {
//       const isMobile =
//         typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

//       let playingWasPaused = false;

//       Object.entries(videosRef.current).forEach(([id, video]) => {
//         if (!video || video.paused) {
//           return;
//         }

//         const isCenterVideo =
//           centerId !== null && String(id) === String(centerId);

//         const isPendingVideo =
//           pendingId !== null && String(id) === String(pendingId);

//         // The user has just clicked this side video. Do not let
//         // the scroll update interrupt it while it is moving.
//         if (isPendingVideo) {
//           return;
//         }

//         // Desktop/tablet: only the center video may remain playing.
//         if (!isMobile && !isCenterVideo) {
//           video.pause();
//           playingWasPaused = true;
//           return;
//         }

//         // Mobile: stop videos only after they have actually been
//         // visible and then move completely outside the viewport.
//         if (isMobile) {
//           const rect = video.getBoundingClientRect();

//           const isOutsideViewport =
//             rect.right <= 0 ||
//             rect.left >= window.innerWidth ||
//             rect.bottom <= 0 ||
//             rect.top >= window.innerHeight;

//           if (!isOutsideViewport) {
//             mobileSeenVideoIdsRef.current.add(String(id));
//           } else if (mobileSeenVideoIdsRef.current.has(String(id))) {
//             video.pause();
//             playingWasPaused = true;
//           }
//         }
//       });

//       if (playingWasPaused) {
//         setPlayingId((current) => {
//           if (current === null) {
//             return current;
//           }

//           const currentVideo = videosRef.current[current];

//           return currentVideo && !currentVideo.paused ? current : null;
//         });
//       }
//     },
//     [],
//   );

//   /* =======================================================
//   SECTION HEIGHT
//   ======================================================= */

//   useEffect(() => {
//     const outer = outerRef.current;

//     const track = trackRef.current;

//     if (!outer || !track) {
//       return;
//     }

//     const updateHeight = () => {
//       const travel = Math.max(0, track.scrollWidth - window.innerWidth);

//       outer.style.height = `${travel + window.innerHeight}px`;
//     };

//     updateHeight();

//     const resizeObserver = new ResizeObserver(updateHeight);

//     resizeObserver.observe(track);

//     window.addEventListener("resize", updateHeight);

//     return () => {
//       resizeObserver.disconnect();

//       window.removeEventListener("resize", updateHeight);
//     };
//   }, [images]);

//   /* =======================================================
//   GSAP HORIZONTAL SCROLL
//   ======================================================= */

//   useLayoutEffect(() => {
//     const outer = outerRef.current;

//     const track = trackRef.current;

//     if (!outer || !track || !images.length) {
//       return;
//     }

//     const context = gsap.context(() => {
//       const getTravel = () =>
//         Math.max(0, track.scrollWidth - window.innerWidth);

//       /* ===============================================
//         HORIZONTAL TRACK
//         =============================================== */

//       const horizontalTween = gsap.to(track, {
//         x: () => -getTravel(),

//         ease: "none",

//         scrollTrigger: {
//           trigger: outer,

//           start: "top top",

//           end: () => `+=${getTravel()}`,

//           scrub: reducedMotion
//             ? true
//             : window.innerWidth < 768
//               ? 0.35
//               : scrollSmoothing,

//           invalidateOnRefresh: true,

//           onUpdate: (self) => {
//             const viewportCenter = window.innerWidth / 2;

//             let closestIndex = 0;

//             let closestDistance = Infinity;

//             // At the absolute boundaries, use ScrollTrigger progress
//             // as the source of truth. This guarantees the first/last
//             // navigation button becomes disabled even if transforms
//             // leave the card a few pixels away from the exact viewport center.
//             const isAtFirstSlide = self.progress <= 0.001;
//             const isAtLastSlide = self.progress >= 0.999;

//             if (isAtFirstSlide) {
//               closestIndex = 0;
//             } else if (isAtLastSlide) {
//               closestIndex = images.length - 1;
//             }

//             if (!isAtFirstSlide && !isAtLastSlide) {
//               wrappersRef.current.forEach((wrapper, index) => {
//                 if (!wrapper) {
//                   return;
//                 }

//                 const rect = wrapper.getBoundingClientRect();

//                 const slideCenter = rect.left + rect.width / 2;

//                 const distance = Math.abs(slideCenter - viewportCenter);

//                 if (distance < closestDistance) {
//                   closestDistance = distance;

//                   closestIndex = index;
//                 }
//               });
//             }

//             /*
//              * IMPORTANT:
//              *
//              * index is only used to
//              * find the item in the
//              * current array order.
//              *
//              * Identity is item.id.
//              */

//             const activeItem = images[closestIndex];

//             if (activeItem) {
//               const nextActiveId = activeItem.id;

//               const previousActiveId = previousActiveIdRef.current;

//               if (String(previousActiveId) !== String(nextActiveId)) {
//                 const previousVideo = videosRef.current[previousActiveId];

//                 if (previousVideo) {
//                   previousVideo.pause();
//                 }

//                 setPlayingId((current) =>
//                   String(current) === String(previousActiveId) ? null : current,
//                 );

//                 previousActiveIdRef.current = nextActiveId;

//                 setActiveId(nextActiveId);
//               }

//               // Don't run expensive video calculations
//               // on every scroll frame.
//               if (window.innerWidth >= MOBILE_BREAKPOINT) {
//                 pauseVideosOutsideAllowedArea(
//                   nextActiveId,
//                   pendingVideoPlayIdRef.current,
//                 );
//               }
//             } else {
//               pauseVideosOutsideAllowedArea(
//                 null,
//                 pendingVideoPlayIdRef.current,
//               );
//             }
//           },
//         },
//       });

//       horizontalTweenRef.current = horizontalTween;

//       /* ===============================================
//         CARD ROTATIONS
//         =============================================== */

//       const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

//       const isTablet =
//         window.innerWidth >= MOBILE_BREAKPOINT &&
//         window.innerWidth < TABLET_BREAKPOINT;

//       cardsRef.current.forEach((card, index) => {
//         const wrapper = wrappersRef.current[index];

//         if (!card || !wrapper) {
//           return;
//         }

//         const total = images.length;

//         const mid = Math.floor(total / 2);

//         const step =
//           (isMobile ? MOBILE_STEP : isTablet ? TABLET_STEP : DESKTOP_STEP) *
//           verticalDrift;

//         let offset;

//         if (index < mid) {
//           offset = -((mid - index) * step);
//         } else {
//           offset = (index - mid + 1) * step;
//         }

//         const rotationScale = reducedMotion ? 0.15 : 1;

//         const rotateXValue =
//           (offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE) * rotationScale;

//         const rotateInValue =
//           (isMobile
//             ? MOBILE_ROTATE_IN
//             : isTablet
//               ? TABLET_ROTATE_IN
//               : DESKTOP_ROTATE_IN) *
//           rotationScale *
//           rotationAmount;

//         const rotateOutValue =
//           (isMobile
//             ? MOBILE_ROTATE_OUT
//             : isTablet
//               ? TABLET_ROTATE_OUT
//               : DESKTOP_ROTATE_OUT) *
//           rotationScale *
//           rotationAmount;

//         const timeline = gsap.timeline({
//           scrollTrigger: {
//             trigger: wrapper,

//             containerAnimation: horizontalTween,

//             start: "left 100%",

//             end: "right 0%",

//             scrub: true,

//             invalidateOnRefresh: true,
//           },
//         });

//         timeline
//           .fromTo(
//             card,
//             {
//               rotateY: rotateInValue,

//               rotateX: rotateXValue,

//               opacity: 0.8,

//               y: `${offset}vh`,
//             },
//             {
//               rotateY: 0,

//               rotateX: 0,

//               opacity: 1,

//               y: 0,

//               ease: "none",
//             },
//           )
//           .to(card, {
//             rotateY: rotateOutValue,

//             opacity: 0.9,

//             y: `${-offset}vh`,

//             ease: "none",
//           });
//       });

//       requestAnimationFrame(() => {
//         ScrollTrigger.refresh();
//       });
//     }, outer);

//     return () => {
//       navigationTweenRef.current?.kill();

//       horizontalTweenRef.current = null;

//       context.revert();
//     };
//   }, [
//     images,
//     rotationAmount,
//     verticalDrift,
//     scrollSmoothing,
//     reducedMotion,
//     pauseVideosOutsideAllowedArea,
//   ]);

//   /* =======================================================
//   CENTER SLIDE
//   ======================================================= */

//   const centerSlide = useCallback(
//     (id) => {
//       /*
//        * ID is now used to find the
//        * physical position in the array.
//        *
//        * index is only used internally
//        * for wrappersRef.
//        */

//       const index = images.findIndex((item) => String(item?.id) === String(id));

//       if (index === -1) {
//         return;
//       }

//       const wrapper = wrappersRef.current[index];

//       const horizontalTween = horizontalTweenRef.current;

//       const scrollTrigger = horizontalTween?.scrollTrigger;

//       if (!wrapper || !scrollTrigger) {
//         return;
//       }

//       const rect = wrapper.getBoundingClientRect();

//       const slideCenter = rect.left + rect.width / 2;

//       const viewportCenter = window.innerWidth / 2;

//       const difference = slideCenter - viewportCenter;

//       const currentScroll = window.scrollY;

//       let targetScroll = currentScroll + difference;

//       targetScroll = Math.max(
//         scrollTrigger.start,
//         Math.min(scrollTrigger.end, targetScroll),
//       );

//       /*
//        * ID-based active state.
//        */
//       setActiveId(id);

//       navigationTweenRef.current?.kill();

//       if (reducedMotion) {
//         window.scrollTo({
//           top: targetScroll,

//           behavior: "auto",
//         });

//         ScrollTrigger.update();

//         if (
//           pendingVideoPlayIdRef.current !== null &&
//           String(pendingVideoPlayIdRef.current) === String(id)
//         ) {
//           const pendingId = pendingVideoPlayIdRef.current;

//           pendingVideoPlayIdRef.current = null;
//           playVideo(pendingId);
//         }

//         return;
//       }

//       navigationTweenRef.current = gsap.to(window, {
//         duration: 0.8,

//         ease: "power3.inOut",

//         scrollTo: {
//           y: targetScroll,

//           autoKill: false,
//         },

//         overwrite: true,

//         onComplete: () => {
//           setActiveId(id);

//           ScrollTrigger.update();

//           // Start the video that was clicked before it reached
//           // center. This removes the need for a second click.
//           if (
//             pendingVideoPlayIdRef.current !== null &&
//             String(pendingVideoPlayIdRef.current) === String(id)
//           ) {
//             const pendingId = pendingVideoPlayIdRef.current;

//             pendingVideoPlayIdRef.current = null;
//             playVideo(pendingId);
//           }

//           /*
//            * Refresh cursor/card positions
//            * after navigation finishes.
//            */

//           window.dispatchEvent(
//             new MouseEvent("mousemove", {
//               clientX: window.__rotationMouseX ?? 0,

//               clientY: window.__rotationMouseY ?? 0,
//             }),
//           );
//         },
//       });
//     },
//     [images, reducedMotion, playVideo],
//   );

//   /* =======================================================
//   NEXT
//   ======================================================= */

//   const nextSlide = useCallback(() => {
//     if (!images.length) {
//       return;
//     }

//     /*
//      * Find current position by ID.
//      */
//     const activeIndex = images.findIndex(
//       (item) => String(item?.id) === String(activeId),
//     );

//     const safeIndex = activeIndex === -1 ? 0 : activeIndex;

//     // Do not wrap around. The Next button is disabled on the last slide.
//     if (safeIndex >= images.length - 1) {
//       return;
//     }

//     const next = safeIndex + 1;

//     const nextItem = images[next];

//     if (nextItem) {
//       centerSlide(nextItem.id);
//     }
//   }, [activeId, images, centerSlide]);

//   /* =======================================================
//   PREVIOUS
//   ======================================================= */

//   const previousSlide = useCallback(() => {
//     if (!images.length) {
//       return;
//     }

//     /*
//      * Find current position by ID.
//      */
//     const activeIndex = images.findIndex(
//       (item) => String(item?.id) === String(activeId),
//     );

//     const safeIndex = activeIndex === -1 ? 0 : activeIndex;

//     // Do not wrap around. The Previous button is disabled on the first slide.
//     if (safeIndex <= 0) {
//       return;
//     }

//     const previous = safeIndex - 1;

//     const previousItem = images[previous];

//     if (previousItem) {
//       centerSlide(previousItem.id);
//     }
//   }, [activeId, images, centerSlide]);

//   /* =======================================================
//   IMAGE CLICK
//   ======================================================= */

//   const handleImageClick = useCallback(
//     (id) => {
//       centerSlide(id);
//     },
//     [centerSlide],
//   );

//   /* =======================================================
//   VIDEO CLICK
//   ======================================================= */

//   const handleVideoClick = useCallback(
//     (id) => {
//       const video = videosRef.current[id];

//       if (!video) {
//         return;
//       }

//       const isActive = String(activeId) === String(id);

//       if (video.paused) {
//         if (isActive) {
//           // Center video: play immediately.
//           pendingVideoPlayIdRef.current = null;
//           playVideo(id);
//         } else {
//           // Side video: center it first, then automatically play
//           // when the GSAP navigation finishes.
//           pendingVideoPlayIdRef.current = id;
//           centerSlide(id);
//         }
//       } else {
//         pendingVideoPlayIdRef.current = null;
//         pauseVideo(id);
//       }
//     },
//     [activeId, centerSlide, playVideo, pauseVideo],
//   );

//   /* =======================================================
//   KEYBOARD
//   ======================================================= */

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "ArrowLeft") {
//         previousSlide();
//       }

//       if (event.key === "ArrowRight") {
//         nextSlide();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [previousSlide, nextSlide]);

//   /* =======================================================
//   GLOBAL MOUSE POSITION

//   This is used by RotationCard so that
//   cards can detect the cursor even when
//   GSAP moves the card underneath a
//   stationary mouse.
//   ======================================================= */

//   useEffect(() => {
//     if (window.innerWidth < 768) {
//       return;
//     }

//     const handleMouseMove = (event) => {
//       window.__rotationMouseX = event.clientX;

//       window.__rotationMouseY = event.clientY;
//     };

//     window.addEventListener("mousemove", handleMouseMove, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   /* =======================================================
//   CLEANUP
//   ======================================================= */

//   useEffect(() => {
//     return () => {
//       navigationTweenRef.current?.kill();

//       Object.values(videosRef.current).forEach((video) => {
//         if (video) {
//           video.pause();
//         }
//       });

//       delete window.__rotationMouseX;

//       delete window.__rotationMouseY;
//     };
//   }, []);

//   /* =======================================================
//   EMPTY
//   ======================================================= */

//   if (!images.length) {
//     return null;
//   }

//   /* =======================================================
//   JSX
//   ======================================================= */

//   return (
//     <section
//       ref={outerRef}
//       className="relative w-full
//       "
//     >
//       <div
//         className="sticky top-0 flex h-screen w-full items-center overflow-hidden
//         "
//         style={{
//           perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px`,
//         }}
//       >
//         {/* =================================================
//         HORIZONTAL TRACK
//         ================================================= */}

//         <div
//           ref={trackRef}
//           className="pointer-events-none flex h-full items-center gap-[5vw] pl-[31vw] pr-[31vw] will-change-transform max-[1025px]:gap-[8vw] max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw] max-md:gap-[8vw] max-md:pl-[12.5vw] max-md:pr-[12.5vw]
//           "
//           style={{
//             transformStyle: "preserve-3d",
//           }}
//         >
//           {images.map((item, index) => (
//             <div
//               /*
//                * CHANGED:
//                * React identity is item.id.
//                */
//               key={item?.id}
//               ref={(element) => {
//                 wrappersRef.current[index] = element;
//               }}
//               className="pointer-events-none relative flex shrink-0 h-[45vh] w-[38vw] items-center justify-center max-[1025px]:h-[40vh] max-[1025px]:w-[55vw] max-md:h-[35vh] max-md:w-[75vw]
//                 "
//               style={{
//                 transformStyle: "preserve-3d",
//               }}
//             >
//               <RotationCard
//                 ref={(element) => {
//                   cardsRef.current[index] = element;
//                 }}
//                 item={item}
//                 index={index}
//                 total={images.length}
//                 /*
//                  * CHANGED:
//                  * Active state uses ID.
//                  */
//                 isActive={String(activeId) === String(item?.id)}
//                 /*
//                  * CHANGED:
//                  * Playing state uses ID.
//                  */
//                 isPlaying={String(playingId) === String(item?.id)}
//                 showCaptions={showCaptions}
//                 textColor={textColor}
//                 videoMuted={videoMuted}
//                 videoLoop={videoLoop}
//                 videoPlaysInline={videoPlaysInline}
//                 onRegisterVideo={registerVideo}
//                 onImageClick={handleImageClick}
//                 onVideoClick={handleVideoClick}
//               />
//             </div>
//           ))}
//         </div>

//         {/* =================================================
//         PREVIOUS BUTTON
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Previous slide"
//           disabled={
//             images.findIndex((item) => String(item?.id) === String(activeId)) <=
//             0
//           }
//           onClick={(event) => {
//             event.preventDefault();

//             event.stopPropagation();

//             previousSlide();
//           }}
//           className="
//             absolute
//             left-4
//             top-1/2
//             z-[9999]
//             flex
//             h-11
//             w-11
//             -translate-y-1/2
//             cursor-pointer
//             touch-manipulation
//             items-center
//             disabled:cursor-not-allowed
//             disabled:opacity-40
//             disabled:hover:scale-100
//             disabled:active:scale-100
//             disabled:cursor-not-allowed
//             disabled:opacity-40
//             disabled:hover:scale-100
//             disabled:active:scale-100
//             justify-center
//             rounded-full
//             bg-white
//             text-black
//             shadow-xl
//             transition-all
//             duration-300
//             hover:scale-110
//             active:scale-90
//             sm:left-6
//             sm:h-12
//             sm:w-12
//             lg:left-10
//           "
//         >
//           <ChevronLeft
//             className="
//               h-5
//               w-5
//               sm:h-6
//               sm:w-6
//             "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//         NEXT BUTTON
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Next slide"
//           disabled={
//             images.findIndex((item) => String(item?.id) === String(activeId)) >=
//             images.length - 1
//           }
//           onClick={(event) => {
//             event.preventDefault();

//             event.stopPropagation();

//             nextSlide();
//           }}
//           className="
//             absolute
//             right-4
//             top-1/2
//             z-[9999]
//             flex
//             h-11
//             w-11
//             -translate-y-1/2
//             cursor-pointer
//             touch-manipulation
//             items-center
//             justify-center
//             rounded-full
//             bg-white
//             text-black
//             shadow-xl
//             transition-all
//             duration-300
//             hover:scale-110
//             active:scale-90
//             sm:right-6
//             sm:h-12
//             sm:w-12
//             lg:right-10
//           "
//         >
//           <ChevronRight
//             className="
//               h-5
//               w-5
//               sm:h-6
//               sm:w-6
//             "
//             strokeWidth={1.5}
//           />
//         </button>

//         {/* =================================================
//         COUNTER
//         ================================================= */}

//         <div
//           className="
//             pointer-events-none
//             absolute
//             bottom-5
//             left-1/2
//             z-[9999]
//             -translate-x-1/2
//             rounded-full
//             bg-black/60
//             px-3
//             py-1.5
//             text-[10px]
//             tracking-[0.12em]
//             text-white
//             backdrop-blur-md
//           "
//         >
//           {String(
//             Math.max(
//               0,
//               images.findIndex((item) => String(item?.id) === String(activeId)),
//             ) + 1,
//           ).padStart(2, "0")}{" "}
//           / {String(images.length).padStart(2, "0")}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
// ROTATION CARD
// ========================================================= */

// const RotationCard = forwardRef(
//   (
//     {
//       item,

//       /*
//        * IMPORTANT:
//        *
//        * index is still here ONLY because
//        * GSAP needs the physical position.
//        *
//        * Identity is item.id.
//        */
//       index,

//       total,

//       isActive,

//       isPlaying,

//       showCaptions,

//       textColor,

//       videoMuted,

//       videoLoop,

//       videoPlaysInline,

//       onRegisterVideo,

//       onImageClick,

//       onVideoClick,
//     },
//     ref,
//   ) => {
//     const videoRef = useRef(null);

//     /* =====================================================
//     CUSTOM CURSOR
//     ===================================================== */

//     const cursorRef = useRef(null);

//     const animationRef = useRef(null);

//     const targetX = useRef(0);

//     const targetY = useRef(0);

//     const currentX = useRef(0);

//     const currentY = useRef(0);

//     const isHoveredRef = useRef(false);

//     const [isHovered, setIsHovered] = useState(false);

//     /* =====================================================
//     DATA
//     ===================================================== */

//     const src = typeof item === "string" ? item : item?.src;

//     const caption = typeof item === "object" ? item?.text : "";

//     const mediaType =
//       typeof item === "object" && item?.type
//         ? item.type
//         : isVideoSource(src)
//           ? "video"
//           : "image";

//     const isVideo = mediaType === "video";

//     /*
//      * CHANGED:
//      *
//      * ID comes from item.id.
//      */
//     const itemId = item?.id;

//     /* =====================================================
//     REGISTER VIDEO
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       /*
//        * CHANGED:
//        * Register video using ID.
//        */
//       onRegisterVideo(itemId, videoRef.current);

//       return () => {
//         onRegisterVideo(itemId, null);
//       };
//     }, [itemId, isVideo, onRegisterVideo]);

//     /* =====================================================
//     VIDEO INITIAL STATE
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) {
//         return;
//       }

//       const video = videoRef.current;

//       if (!video) {
//         return;
//       }

//       video.pause();

//       video.muted = true;

//       video.volume = 1;

//       video.playsInline = true;
//     }, [isVideo]);

//     /* =====================================================
//     CUSTOM CURSOR LERP

//     Cursor is rendered inside the card.

//     IMPORTANT:
//     pointer-events-none means the cursor
//     can NEVER interfere with the video.
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) return;

//       // Custom cursor is desktop/tablet only.
//       if (window.innerWidth < 768) {
//         return;
//       }

//       const animateCursor = () => {
//         currentX.current += (targetX.current - currentX.current) * 0.12;

//         currentY.current += (targetY.current - currentY.current) * 0.12;

//         if (cursorRef.current) {
//           cursorRef.current.style.transform = `translate3d(
//           ${currentX.current}px,
//           ${currentY.current}px,
//           0
//         ) translate(-50%, -50%)`;
//         }

//         animationRef.current = requestAnimationFrame(animateCursor);
//       };

//       animationRef.current = requestAnimationFrame(animateCursor);

//       return () => {
//         if (animationRef.current) {
//           cancelAnimationFrame(animationRef.current);
//         }
//       };
//     }, [isVideo]);

//     /* =====================================================
//     GLOBAL CURSOR DETECTION

//     THIS IS THE IMPORTANT FIX.

//     We do NOT rely on mouseenter.

//     If GSAP moves the card underneath
//     a stationary mouse, getBoundingClientRect()
//     will detect that the mouse is now inside
//     the card.

//     CHANGED:
//     The element is now found by item.id.
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) return;

//       // No custom cursor logic on mobile.
//       if (window.innerWidth < 768) {
//         return;
//       }

//       const mediaElement = document.querySelector(
//         `[data-rotation-video="${itemId}"]`,
//       );

//       if (!mediaElement) {
//         return;
//       }

//       const handleGlobalMouseMove = (event) => {
//         const rect = mediaElement.getBoundingClientRect();

//         const isInside =
//           event.clientX >= rect.left &&
//           event.clientX <= rect.right &&
//           event.clientY >= rect.top &&
//           event.clientY <= rect.bottom;

//         if (isInside) {
//           const x = event.clientX - rect.left;

//           const y = event.clientY - rect.top;

//           targetX.current = x;
//           targetY.current = y;

//           if (!isHoveredRef.current) {
//             currentX.current = x;
//             currentY.current = y;

//             isHoveredRef.current = true;
//             setIsHovered(true);
//           }
//         } else if (isHoveredRef.current) {
//           isHoveredRef.current = false;
//           setIsHovered(false);
//         }
//       };

//       window.addEventListener("mousemove", handleGlobalMouseMove, {
//         passive: true,
//       });

//       return () => {
//         window.removeEventListener("mousemove", handleGlobalMouseMove);

//         isHoveredRef.current = false;
//       };
//     }, [isVideo, itemId]);

//     /* =====================================================
//     EXTRA CHECK AFTER SCROLL

//     This fixes the exact situation where
//     the card moves under a stationary mouse
//     without mousemove firing.

//     CHANGED:
//     Element is located by item.id.
//     ===================================================== */

//     useEffect(() => {
//       if (!isVideo) return;

//       // This effect is only needed for desktop
//       // because it fixes the custom cursor when
//       // GSAP moves a card under a stationary mouse.
//       if (window.innerWidth < 768) {
//         return;
//       }

//       let frameId = null;

//       const checkCursorPosition = () => {
//         const mediaElement = document.querySelector(
//           `[data-rotation-video="${itemId}"]`,
//         );

//         const mouseX = window.__rotationMouseX;

//         const mouseY = window.__rotationMouseY;

//         if (
//           !mediaElement ||
//           typeof mouseX !== "number" ||
//           typeof mouseY !== "number"
//         ) {
//           frameId = requestAnimationFrame(checkCursorPosition);

//           return;
//         }

//         const rect = mediaElement.getBoundingClientRect();

//         const isInside =
//           mouseX >= rect.left &&
//           mouseX <= rect.right &&
//           mouseY >= rect.top &&
//           mouseY <= rect.bottom;

//         if (isInside) {
//           const x = mouseX - rect.left;

//           const y = mouseY - rect.top;

//           targetX.current = x;
//           targetY.current = y;

//           if (!isHoveredRef.current) {
//             currentX.current = x;
//             currentY.current = y;

//             isHoveredRef.current = true;
//             setIsHovered(true);
//           }
//         } else if (isHoveredRef.current) {
//           isHoveredRef.current = false;
//           setIsHovered(false);
//         }

//         frameId = requestAnimationFrame(checkCursorPosition);
//       };

//       frameId = requestAnimationFrame(checkCursorPosition);

//       return () => {
//         if (frameId) {
//           cancelAnimationFrame(frameId);
//         }
//       };
//     }, [isVideo, itemId]);

//     /* =====================================================
//     IMAGE CLICK
//     ===================================================== */

//     const handleImageClick = (event) => {
//       event.preventDefault();

//       event.stopPropagation();

//       /*
//        * CHANGED:
//        * Send ID.
//        */
//       onImageClick(itemId);
//     };

//     /* =====================================================
//     VIDEO CLICK
//     ===================================================== */

//     const handleVideoClick = (event) => {
//       event.preventDefault();

//       event.stopPropagation();

//       /*
//        * CHANGED:
//        * Send ID.
//        */
//       onVideoClick(itemId);
//     };

//     /* =====================================================
//     RENDER
//     ===================================================== */

//     return (
//       <div
//         ref={ref}
//         className="
//           absolute
//           h-[50vh]
//           w-[38vw]
//           origin-right
//           overflow-hidden
//           rounded-[24px]
//           bg-black
//           opacity-0
//           max-[1025px]:h-[40vh]
//           max-[1025px]:w-[50vw]
//           max-md:h-[35vh]
//           max-md:w-[75vw]
//         "
//         style={{
//           transformStyle: "preserve-3d",

//           /*
//            * IMPORTANT:
//            *
//            * z-index remains index based
//            * because this is visual/render order,
//            * NOT item identity.
//            */
//           zIndex: isActive ? 1000 : 100 + (total - index),
//         }}
//       >
//         {/* =================================================
//         MEDIA CONTAINER
//         ================================================= */}

//         <div
//           /*
//            * CHANGED:
//            *
//            * data attribute now uses ID.
//            */
//           data-rotation-video={isVideo ? itemId : undefined}
//           className="
//             relative
//             h-full
//             w-full
//             overflow-hidden
//           "
//         >
//           {/* ===============================================
//           VIDEO
//           =============================================== */}

//           {isVideo ? (
//             <>
//               <video
//                 ref={videoRef}
//                 src={src}
//                 muted={true}
//                 loop={item?.loop ?? videoLoop}
//                 playsInline={item?.playsInline ?? videoPlaysInline}
//                 preload="metadata"
//                 className="
//                   absolute
//                   inset-0
//                   h-full
//                   w-full
//                   cursor-none
//                   select-none
//                   object-cover
//                   touch-manipulation
//                   pointer-events-auto
//                 "
//                 onClick={handleVideoClick}
//               />

//               {/* =========================================
//               DESKTOP CUSTOM CURSOR
//               ========================================= */}

//               <div
//                 ref={cursorRef}
//                 className={`
//                   pointer-events-none
//                   absolute
//                   left-0
//                   top-0
//                   z-[100]
//                   hidden
//                   h-14
//                   w-14
//                   items-center
//                   justify-center
//                   rounded-full
//                   border
//                   border-white/70
//                   bg-black/30
//                   text-white
//                   backdrop-blur-md
//                   transition-opacity
//                   duration-200
//                   md:flex
//                   ${isHovered ? "opacity-100" : "opacity-0"}
//                 `}
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                       h-5
//                       w-5
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                       ml-0.5
//                       h-5
//                       w-5
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </div>

//               {/* =========================================
//               MOBILE PLAY / PAUSE
//               ========================================= */}

//               <button
//                 type="button"
//                 aria-label={isPlaying ? "Pause video" : "Play video"}
//                 onClick={handleVideoClick}
//                 className="
//                   absolute
//                   bottom-4
//                   left-1/2
//                   z-[200]
//                   flex
//                   h-12
//                   w-12
//                   -translate-x-1/2
//                   touch-manipulation
//                   items-center
//                   justify-center
//                   rounded-full
//                   border
//                   border-white/30
//                   bg-black/70
//                   text-white
//                   shadow-xl
//                   backdrop-blur-md
//                   transition-transform
//                   active:scale-90
//                   md:hidden
//                 "
//               >
//                 {isPlaying ? (
//                   <Pause
//                     className="
//                       h-4
//                       w-4
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 ) : (
//                   <Play
//                     className="
//                       ml-0.5
//                       h-4
//                       w-4
//                       fill-white
//                     "
//                     strokeWidth={1.5}
//                   />
//                 )}
//               </button>
//             </>
//           ) : (
//             /* =============================================
//             IMAGE
//             ============================================= */

//             <img
//               src={src}
//               alt={item?.alt || `Slide ${index + 1}`}
//               draggable={false}
//               onClick={handleImageClick}
//               className="
//                 absolute
//                 inset-0
//                 h-full
//                 w-full
//                 cursor-pointer
//                 select-none
//                 object-cover
//                 touch-manipulation
//                 transition-transform
//                 duration-700
//               "
//             />
//           )}
//         </div>

//         {/* =================================================
//         CAPTION
//         ================================================= */}

//         {showCaptions && caption && (
//           <div
//             className="
//                 pointer-events-none
//                 absolute
//                 left-1/2
//                 top-1/2
//                 z-[50]
//                 -translate-x-1/2
//                 -translate-y-1/2
//                 whitespace-nowrap
//                 text-center
//                 text-[1.4vw]
//                 font-medium
//                 max-[1025px]:text-[2.4vw]
//                 max-md:text-[4vw]
//               "
//             style={{
//               color: textColor,

//               textShadow:
//                 "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
//             }}
//           >
//             {caption}
//           </div>
//         )}
//       </div>
//     );
//   },
// );

// RotationCard.displayName = "RotationCard";
"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
// import PolishPerfectionSection from "@/components/PolishPerfectionSection";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* =========================================================
BREAKPOINTS
========================================================= */

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;

/* =========================================================
ROTATION SETTINGS
========================================================= */

const MOBILE_STEP = 2;
const TABLET_STEP = 6;
const DESKTOP_STEP = 10;

const MOBILE_ROTATE_IN = -60;
const TABLET_ROTATE_IN = -80;
const DESKTOP_ROTATE_IN = -100;

const MOBILE_ROTATE_OUT = 50;
const TABLET_ROTATE_OUT = 65;
const DESKTOP_ROTATE_OUT = 80;

const ROTATE_X_NEGATIVE = 5;
const ROTATE_X_POSITIVE = -5;

const REDUCED_PERSPECTIVE = "4800px";

/* =========================================================
REDUCED MOTION
========================================================= */

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

/* =========================================================
VIDEO DETECTION
========================================================= */

function isVideoSource(src = "") {
  return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(src);
}

/* =========================================================
MAIN COMPONENT
========================================================= */

export function RotationSliderComp({
  categoryId,
  images = [],

  rotationAmount = 1,

  verticalDrift = 1,

  scrollSmoothing = 1,

  perspective = 1200,

  showCaptions = true,

  textColor = "#ffffff",

  videoMuted = true,

  videoLoop = true,

  videoPlaysInline = true,
}) {
  const outerRef = useRef(null);

  const trackRef = useRef(null);

  const cardsRef = useRef([]);

  const wrappersRef = useRef([]);

  /*
   * CHANGED:
   *
   * Videos are now stored using item.id.
   *
   * videosRef.current[id] = video
   */
  const videosRef = useRef({});

  // Tracks videos that have actually entered the mobile viewport.
  // This prevents a video clicked from a side card from being
  // immediately paused before it has a chance to reach center.
  const mobileSeenVideoIdsRef = useRef(new Set());

  const horizontalTweenRef = useRef(null);

  const navigationTweenRef = useRef(null);

  // The animation engine is created only while this category is
  // actually inside the viewport. This prevents all categories
  // from initializing their ScrollTriggers on page load.
  const [isInViewport, setIsInViewport] = useState(false);
  const [isAnimationInitialized, setIsAnimationInitialized] = useState(false);
  const isInViewportRef = useRef(false);
  const animationInitializedRef = useRef(false);

  const reducedMotion = prefersReducedMotion();

  /*
   * CHANGED:
   *
   * Active item is identified by ID.
   */
  const [activeId, setActiveId] = useState(images[0]?.id ?? null);

  /*
   * CHANGED:
   *
   * Playing item is identified by ID.
   */
  const [playingId, setPlayingId] = useState(null);

  // If a side video is clicked, keep the ID pending so playback
  // starts automatically after the slide reaches the center.
  const pendingVideoPlayIdRef = useRef(null);

  // Tracks the previous center slide, especially for mobile
  // where the old center video must stop immediately.
  const previousActiveIdRef = useRef(images[0]?.id ?? null);

  /* =======================================================
  REGISTER VIDEO
  ======================================================= */

  const registerVideo = useCallback((id, video) => {
    videosRef.current[id] = video;
  }, []);

  /* =======================================================
  STOP OTHER VIDEOS
  ======================================================= */

  const stopOtherVideos = useCallback((exceptId) => {
    Object.entries(videosRef.current).forEach(([id, video]) => {
      if (video && String(id) !== String(exceptId)) {
        video.pause();
      }
    });
  }, []);

  /* =======================================================
  PLAY VIDEO
  ======================================================= */

  const playVideo = useCallback(
    async (id) => {
      if (!isInViewportRef.current) {
        return;
      }

      const video = videosRef.current[id];

      if (!video) {
        return;
      }

      stopOtherVideos(id);

      try {
        video.muted = false;

        video.volume = 1;

        video.playsInline = true;

        await video.play();

        setPlayingId(id);
      } catch (error) {
        console.warn(
          "Audio playback blocked. Falling back to muted playback.",
          error,
        );

        try {
          video.muted = true;

          await video.play();

          setPlayingId(id);
        } catch (fallbackError) {
          console.error("Video playback failed:", fallbackError);

          setPlayingId(null);
        }
      }
    },
    [stopOtherVideos],
  );

  /* =======================================================
  PAUSE VIDEO
  ======================================================= */

  const pauseVideo = useCallback((id) => {
    const video = videosRef.current[id];

    if (!video) {
      return;
    }

    video.pause();

    setPlayingId((current) =>
      String(current) === String(id) ? null : current,
    );
  }, []);

  /* =======================================================
  TOGGLE VIDEO
  ======================================================= */

  const toggleVideo = useCallback(
    (id) => {
      const video = videosRef.current[id];

      if (!video) {
        return;
      }

      if (video.paused) {
        playVideo(id);
      } else {
        pauseVideo(id);
      }
    },
    [playVideo, pauseVideo],
  );

  /* =======================================================
  INITIAL VIDEO STATE
  ======================================================= */

  useEffect(() => {
    Object.values(videosRef.current).forEach((video) => {
      if (!video) {
        return;
      }

      video.pause();

      video.muted = true;

      video.volume = 1;

      video.playsInline = true;
    });

    setPlayingId(null);
    pendingVideoPlayIdRef.current = null;
    previousActiveIdRef.current = images[0]?.id ?? null;
  }, [images]);

  /* =======================================================
  AUTO PAUSE VIDEOS OUTSIDE THEIR ALLOWED AREA

  Desktop / tablet:
  - Only the center slide is allowed to keep playing.

  Mobile:
  - A video is also paused when it is completely outside
    the viewport.
  ======================================================= */

  const pauseVideosOutsideAllowedArea = useCallback(
    (centerId = null, pendingId = null) => {
      const isMobile =
        typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

      let playingWasPaused = false;

      Object.entries(videosRef.current).forEach(([id, video]) => {
        if (!video || video.paused) {
          return;
        }

        const isCenterVideo =
          centerId !== null && String(id) === String(centerId);

        const isPendingVideo =
          pendingId !== null && String(id) === String(pendingId);

        // The user has just clicked this side video. Do not let
        // the scroll update interrupt it while it is moving.
        if (isPendingVideo) {
          return;
        }

        // Desktop/tablet: only the center video may remain playing.
        if (!isMobile && !isCenterVideo) {
          video.pause();
          playingWasPaused = true;
          return;
        }

        // Mobile: stop videos only after they have actually been
        // visible and then move completely outside the viewport.
        if (isMobile) {
          const rect = video.getBoundingClientRect();

          const isOutsideViewport =
            rect.right <= 0 ||
            rect.left >= window.innerWidth ||
            rect.bottom <= 0 ||
            rect.top >= window.innerHeight;

          if (!isOutsideViewport) {
            mobileSeenVideoIdsRef.current.add(String(id));
          } else if (mobileSeenVideoIdsRef.current.has(String(id))) {
            video.pause();
            playingWasPaused = true;
          }
        }
      });

      if (playingWasPaused) {
        setPlayingId((current) => {
          if (current === null) {
            return current;
          }

          const currentVideo = videosRef.current[current];

          return currentVideo && !currentVideo.paused ? current : null;
        });
      }
    },
    [],
  );

  /* =======================================================
  VIEWPORT ACTIVATION

  Only initialize this category's animation engine when the
  category itself enters the browser viewport. When it leaves,
  videos are paused and the GSAP context is cleaned up by the
  effect below.
  ======================================================= */

  useEffect(() => {
    const outer = outerRef.current;

    if (!outer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;

        isInViewportRef.current = visible;
        setIsInViewport(visible);

        // IMPORTANT: initialize GSAP only once.
        // We intentionally do NOT destroy/recreate the GSAP context when
        // the category leaves the viewport. Reverting it changes the
        // card transforms back to their initial state, which causes the
        // slider to look different when the user scrolls back up.
        if (visible && !animationInitializedRef.current) {
          animationInitializedRef.current = true;
          setIsAnimationInitialized(true);
        }

        if (!visible) {
          Object.values(videosRef.current).forEach((video) => {
            if (video && !video.paused) {
              video.pause();
            }
          });

          setPlayingId(null);
          pendingVideoPlayIdRef.current = null;
        }
      },
      {
        root: null,
        // Pre-build the animation slightly before it reaches the viewport.
        // After initialization it stays alive so its visual state is preserved.
        rootMargin: "100% 0px 100% 0px",
        threshold: 0,
      },
    );

    observer.observe(outer);

    return () => {
      observer.disconnect();
      isInViewportRef.current = false;
    };
  }, []);

  /* =======================================================
  SECTION HEIGHT
  ======================================================= */

  useEffect(() => {
    const outer = outerRef.current;

    const track = trackRef.current;

    if (!outer || !track) {
      return;
    }

    const updateHeight = () => {
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);

      outer.style.height = `${travel + window.innerHeight}px`;
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    resizeObserver.observe(track);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", updateHeight);
    };
  }, [images]);

  /* =======================================================
  GSAP HORIZONTAL SCROLL
  ======================================================= */

  useLayoutEffect(() => {
    const outer = outerRef.current;

    const track = trackRef.current;

    if (!outer || !track || !images.length) {
      return;
    }

    // Create the GSAP engine only once, when this category first gets
    // close enough to the viewport. Once created, keep it alive so
    // returning to the category preserves the exact slider structure.
    if (!isAnimationInitialized) {
      return;
    }

    const context = gsap.context(() => {
      const getTravel = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      /* ===============================================
        HORIZONTAL TRACK
        =============================================== */

      const horizontalTween = gsap.to(track, {
        x: () => -getTravel(),

        ease: "none",

        scrollTrigger: {
          trigger: outer,

          start: "top top",

          end: () => `+=${getTravel()}`,

          scrub: reducedMotion
            ? true
            : window.innerWidth < 768
              ? 0.35
              : scrollSmoothing,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const viewportCenter = window.innerWidth / 2;

            let closestIndex = 0;

            let closestDistance = Infinity;

            // At the absolute boundaries, use ScrollTrigger progress
            // as the source of truth. This guarantees the first/last
            // navigation button becomes disabled even if transforms
            // leave the card a few pixels away from the exact viewport center.
            const isAtFirstSlide = self.progress <= 0.001;
            const isAtLastSlide = self.progress >= 0.999;

            if (isAtFirstSlide) {
              closestIndex = 0;
            } else if (isAtLastSlide) {
              closestIndex = images.length - 1;
            }

            if (!isAtFirstSlide && !isAtLastSlide) {
              wrappersRef.current.forEach((wrapper, index) => {
                if (!wrapper) {
                  return;
                }

                const rect = wrapper.getBoundingClientRect();

                const slideCenter = rect.left + rect.width / 2;

                const distance = Math.abs(slideCenter - viewportCenter);

                if (distance < closestDistance) {
                  closestDistance = distance;

                  closestIndex = index;
                }
              });
            }

            /*
             * IMPORTANT:
             *
             * index is only used to
             * find the item in the
             * current array order.
             *
             * Identity is item.id.
             */

            const activeItem = images[closestIndex];

            if (activeItem) {
              const nextActiveId = activeItem.id;

              const previousActiveId = previousActiveIdRef.current;

              if (String(previousActiveId) !== String(nextActiveId)) {
                const previousVideo = videosRef.current[previousActiveId];

                if (previousVideo) {
                  previousVideo.pause();
                }

                setPlayingId((current) =>
                  String(current) === String(previousActiveId) ? null : current,
                );

                previousActiveIdRef.current = nextActiveId;

                setActiveId(nextActiveId);
              }

              // Don't run expensive video calculations
              // on every scroll frame.
              if (window.innerWidth >= MOBILE_BREAKPOINT) {
                pauseVideosOutsideAllowedArea(
                  nextActiveId,
                  pendingVideoPlayIdRef.current,
                );
              }
            } else {
              pauseVideosOutsideAllowedArea(
                null,
                pendingVideoPlayIdRef.current,
              );
            }
          },
        },
      });

      horizontalTweenRef.current = horizontalTween;

      /* ===============================================
        CARD ROTATIONS
        =============================================== */

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      const isTablet =
        window.innerWidth >= MOBILE_BREAKPOINT &&
        window.innerWidth < TABLET_BREAKPOINT;

      cardsRef.current.forEach((card, index) => {
        const wrapper = wrappersRef.current[index];

        if (!card || !wrapper) {
          return;
        }

        const total = images.length;

        const mid = Math.floor(total / 2);

        const step =
          (isMobile ? MOBILE_STEP : isTablet ? TABLET_STEP : DESKTOP_STEP) *
          verticalDrift;

        let offset;

        if (index < mid) {
          offset = -((mid - index) * step);
        } else {
          offset = (index - mid + 1) * step;
        }

        const rotationScale = reducedMotion ? 0.15 : 1;

        const rotateXValue =
          (offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE) * rotationScale;

        const rotateInValue =
          (isMobile
            ? MOBILE_ROTATE_IN
            : isTablet
              ? TABLET_ROTATE_IN
              : DESKTOP_ROTATE_IN) *
          rotationScale *
          rotationAmount;

        const rotateOutValue =
          (isMobile
            ? MOBILE_ROTATE_OUT
            : isTablet
              ? TABLET_ROTATE_OUT
              : DESKTOP_ROTATE_OUT) *
          rotationScale *
          rotationAmount;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,

            containerAnimation: horizontalTween,

            start: "left 100%",

            end: "right 0%",

            scrub: true,

            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            card,
            {
              rotateY: rotateInValue,

              rotateX: rotateXValue,

              opacity: 0.8,

              y: `${offset}vh`,
            },
            {
              rotateY: 0,

              rotateX: 0,

              opacity: 1,

              y: 0,

              ease: "none",
            },
          )
          .to(card, {
            rotateY: rotateOutValue,

            opacity: 0.9,

            y: `${-offset}vh`,

            ease: "none",
          });
      });

      requestAnimationFrame(() => {
        if (isInViewportRef.current) {
          ScrollTrigger.refresh();
        }
      });
    }, outer);

    return () => {
      navigationTweenRef.current?.kill();

      horizontalTweenRef.current = null;

      context.revert();
    };
  }, [
    images,
    rotationAmount,
    verticalDrift,
    scrollSmoothing,
    reducedMotion,
    pauseVideosOutsideAllowedArea,
    isAnimationInitialized,
  ]);

  /* =======================================================
  CENTER SLIDE
  ======================================================= */

  const centerSlide = useCallback(
    (id) => {
      if (!isInViewportRef.current) {
        return;
      }

      /*
       * ID is now used to find the
       * physical position in the array.
       *
       * index is only used internally
       * for wrappersRef.
       */

      const index = images.findIndex((item) => String(item?.id) === String(id));

      if (index === -1) {
        return;
      }

      const wrapper = wrappersRef.current[index];

      const horizontalTween = horizontalTweenRef.current;

      const scrollTrigger = horizontalTween?.scrollTrigger;

      if (!wrapper || !scrollTrigger) {
        return;
      }

      const rect = wrapper.getBoundingClientRect();

      const slideCenter = rect.left + rect.width / 2;

      const viewportCenter = window.innerWidth / 2;

      const difference = slideCenter - viewportCenter;

      const currentScroll = window.scrollY;

      let targetScroll = currentScroll + difference;

      targetScroll = Math.max(
        scrollTrigger.start,
        Math.min(scrollTrigger.end, targetScroll),
      );

      /*
       * ID-based active state.
       */
      setActiveId(id);

      navigationTweenRef.current?.kill();

      if (reducedMotion) {
        window.scrollTo({
          top: targetScroll,

          behavior: "auto",
        });

        ScrollTrigger.update();

        if (
          pendingVideoPlayIdRef.current !== null &&
          String(pendingVideoPlayIdRef.current) === String(id)
        ) {
          const pendingId = pendingVideoPlayIdRef.current;

          pendingVideoPlayIdRef.current = null;
          playVideo(pendingId);
        }

        return;
      }

      navigationTweenRef.current = gsap.to(window, {
        duration: 0.8,

        ease: "power3.inOut",

        scrollTo: {
          y: targetScroll,

          autoKill: false,
        },

        overwrite: true,

        onComplete: () => {
          setActiveId(id);

          ScrollTrigger.update();

          // Start the video that was clicked before it reached
          // center. This removes the need for a second click.
          if (
            pendingVideoPlayIdRef.current !== null &&
            String(pendingVideoPlayIdRef.current) === String(id)
          ) {
            const pendingId = pendingVideoPlayIdRef.current;

            pendingVideoPlayIdRef.current = null;
            playVideo(pendingId);
          }

          /*
           * Refresh cursor/card positions
           * after navigation finishes.
           */

          window.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: window.__rotationMouseX ?? 0,

              clientY: window.__rotationMouseY ?? 0,
            }),
          );
        },
      });
    },
    [images, reducedMotion, playVideo],
  );

  /* =======================================================
  NEXT
  ======================================================= */

  const nextSlide = useCallback(() => {
    if (!images.length) {
      return;
    }

    /*
     * Find current position by ID.
     */
    const activeIndex = images.findIndex(
      (item) => String(item?.id) === String(activeId),
    );

    const safeIndex = activeIndex === -1 ? 0 : activeIndex;

    // Do not wrap around. The Next button is disabled on the last slide.
    if (safeIndex >= images.length - 1) {
      return;
    }

    const next = safeIndex + 1;

    const nextItem = images[next];

    if (nextItem) {
      centerSlide(nextItem.id);
    }
  }, [activeId, images, centerSlide]);

  /* =======================================================
  PREVIOUS
  ======================================================= */

  const previousSlide = useCallback(() => {
    if (!images.length) {
      return;
    }

    /*
     * Find current position by ID.
     */
    const activeIndex = images.findIndex(
      (item) => String(item?.id) === String(activeId),
    );

    const safeIndex = activeIndex === -1 ? 0 : activeIndex;

    // Do not wrap around. The Previous button is disabled on the first slide.
    if (safeIndex <= 0) {
      return;
    }

    const previous = safeIndex - 1;

    const previousItem = images[previous];

    if (previousItem) {
      centerSlide(previousItem.id);
    }
  }, [activeId, images, centerSlide]);

  /* =======================================================
  IMAGE CLICK
  ======================================================= */

  const handleImageClick = useCallback(
    (id) => {
      centerSlide(id);
    },
    [centerSlide],
  );

  /* =======================================================
  VIDEO CLICK
  ======================================================= */

  const handleVideoClick = useCallback(
    (id) => {
      const video = videosRef.current[id];

      if (!video) {
        return;
      }

      const isActive = String(activeId) === String(id);

      if (video.paused) {
        if (isActive) {
          // Center video: play immediately.
          pendingVideoPlayIdRef.current = null;
          playVideo(id);
        } else {
          // Side video: center it first, then automatically play
          // when the GSAP navigation finishes.
          pendingVideoPlayIdRef.current = id;
          centerSlide(id);
        }
      } else {
        pendingVideoPlayIdRef.current = null;
        pauseVideo(id);
      }
    },
    [activeId, centerSlide, playVideo, pauseVideo],
  );

  /* =======================================================
  KEYBOARD
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isInViewportRef.current) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousSlide();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previousSlide, nextSlide]);

  /* =======================================================
  GLOBAL MOUSE POSITION

  This is used by RotationCard so that
  cards can detect the cursor even when
  GSAP moves the card underneath a
  stationary mouse.
  ======================================================= */

  useEffect(() => {
    if (window.innerWidth < 768 || !isInViewport) {
      return;
    }

    const handleMouseMove = (event) => {
      window.__rotationMouseX = event.clientX;

      window.__rotationMouseY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInViewport]);

  /* =======================================================
  CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      navigationTweenRef.current?.kill();

      Object.values(videosRef.current).forEach((video) => {
        if (video) {
          video.pause();
        }
      });

      delete window.__rotationMouseX;

      delete window.__rotationMouseY;
    };
  }, []);

  /* =======================================================
  EMPTY
  ======================================================= */

  if (!images.length) {
    return null;
  }

  /* =======================================================
  JSX
  ======================================================= */

  return (
    <section
      ref={outerRef}
      className="relative w-full
      "
    >
      <div
        className="sticky top-0 flex h-screen w-full items-center overflow-hidden
        "
        style={{
          perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px`,
        }}
      >
        {/* =================================================
        HORIZONTAL TRACK
        ================================================= */}

        <div
          ref={trackRef}
          className="pointer-events-none flex h-full items-center gap-[5vw] pl-[31vw] pr-[31vw] will-change-transform max-[1025px]:gap-[8vw] max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw] max-md:gap-[8vw] max-md:pl-[12.5vw] max-md:pr-[12.5vw]
          "
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {images.map((item, index) => (
            <div
              /*
               * CHANGED:
               * React identity is item.id.
               */
              key={item?.id}
              ref={(element) => {
                wrappersRef.current[index] = element;
              }}
              className="pointer-events-none relative flex shrink-0 h-[45vh] w-[38vw] items-center justify-center max-[1025px]:h-[40vh] max-[1025px]:w-[55vw] max-md:h-[35vh] max-md:w-[75vw]
                "
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <RotationCard
               categoryId={categoryId}
                ref={(element) => {
                  cardsRef.current[index] = element;
                }}
                item={item}
                index={index}
                total={images.length}
                /*
                 * CHANGED:
                 * Active state uses ID.
                 */
                isActive={String(activeId) === String(item?.id)}
                /*
                 * CHANGED:
                 * Playing state uses ID.
                 */
                isPlaying={String(playingId) === String(item?.id)}
                isSectionInViewport={isInViewport}
                showCaptions={showCaptions}
                textColor={textColor}
                videoMuted={videoMuted}
                videoLoop={videoLoop}
                videoPlaysInline={videoPlaysInline}
                onRegisterVideo={registerVideo}
                onImageClick={handleImageClick}
                onVideoClick={handleVideoClick}
              />
            </div>
          ))}
        </div>

        {/* =================================================
        PREVIOUS BUTTON
        ================================================= */}

        <button
          type="button"
          aria-label="Previous slide"
          disabled={
            images.findIndex((item) => String(item?.id) === String(activeId)) <=
            0
          }
          onClick={(event) => {
            event.preventDefault();

            event.stopPropagation();

            previousSlide();
          }}
          className="
            absolute
            left-4
            top-1/2
            z-[9999]
            flex
            h-11
            w-11
            -translate-y-1/2
            cursor-pointer
            touch-manipulation
            items-center
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:scale-100
            disabled:active:scale-100
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:scale-100
            disabled:active:scale-100
            justify-center
            rounded-full
            bg-white
            text-black
            shadow-xl
            transition-all
            duration-300
            hover:scale-110
            active:scale-90
            sm:left-6
            sm:h-12
            sm:w-12
            lg:left-10
          "
        >
          <ChevronLeft
            className="
              h-5
              w-5
              sm:h-6
              sm:w-6
            "
            strokeWidth={1.5}
          />
        </button>

        {/* =================================================
        NEXT BUTTON
        ================================================= */}

        <button
          type="button"
          aria-label="Next slide"
          disabled={
            images.findIndex((item) => String(item?.id) === String(activeId)) >=
            images.length - 1
          }
          onClick={(event) => {
            event.preventDefault();

            event.stopPropagation();

            nextSlide();
          }}
          className="
            absolute
            right-4
            top-1/2
            z-[9999]
            flex
            h-11
            w-11
            -translate-y-1/2
            cursor-pointer
            touch-manipulation
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            shadow-xl
            transition-all
            duration-300
            hover:scale-110
            active:scale-90
            sm:right-6
            sm:h-12
            sm:w-12
            lg:right-10
          "
        >
          <ChevronRight
            className="
              h-5
              w-5
              sm:h-6
              sm:w-6
            "
            strokeWidth={1.5}
          />
        </button>

        {/* =================================================
        COUNTER
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-5
            left-1/2
            z-[9999]
            -translate-x-1/2
            rounded-full
            bg-black/60
            px-3
            py-1.5
            text-[10px]
            tracking-[0.12em]
            text-white
            backdrop-blur-md
          "
        >
          {String(
            Math.max(
              0,
              images.findIndex((item) => String(item?.id) === String(activeId)),
            ) + 1,
          ).padStart(2, "0")}{" "}
          / {String(images.length).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
ROTATION CARD
========================================================= */

const RotationCard = forwardRef(
  (
    {
      item,

      /*
       * IMPORTANT:
       *
       * index is still here ONLY because
       * GSAP needs the physical position.
       *
       * Identity is item.id.
       */
      index,

      total,

      isActive,

      isPlaying,

      isSectionInViewport,

      showCaptions,

      textColor,

      videoMuted,

      videoLoop,

      videoPlaysInline,

      onRegisterVideo,

      onImageClick,

      onVideoClick,
    },
    ref,
  ) => {
    const videoRef = useRef(null);
    const mediaRef = useRef(null);

    /* =====================================================
    CUSTOM CURSOR
    ===================================================== */

    const cursorRef = useRef(null);

    const animationRef = useRef(null);

    const targetX = useRef(0);

    const targetY = useRef(0);

    const currentX = useRef(0);

    const currentY = useRef(0);

    const isHoveredRef = useRef(false);

    const [isHovered, setIsHovered] = useState(false);

    /* =====================================================
    DATA
    ===================================================== */

    const src = typeof item === "string" ? item : item?.src;

    const caption = typeof item === "object" ? item?.text : "";

    const mediaType =
      typeof item === "object" && item?.type
        ? item.type
        : isVideoSource(src)
          ? "video"
          : "image";

    const isVideo = mediaType === "video";

    /*
     * CHANGED:
     *
     * ID comes from item.id.
     */
    const itemId = item?.id;

    /* =====================================================
    REGISTER VIDEO
    ===================================================== */

    useEffect(() => {
      if (!isVideo) {
        return;
      }

      /*
       * CHANGED:
       * Register video using ID.
       */
      onRegisterVideo(itemId, videoRef.current);

      return () => {
        onRegisterVideo(itemId, null);
      };
    }, [itemId, isVideo, onRegisterVideo]);

    /* =====================================================
    VIDEO INITIAL STATE
    ===================================================== */

    useEffect(() => {
      if (!isVideo) {
        return;
      }

      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.pause();

      video.muted = true;

      video.volume = 1;

      video.playsInline = true;
    }, [isVideo]);

    useEffect(() => {
      if (isSectionInViewport) {
        return;
      }

      const video = videoRef.current;

      if (video) {
        video.pause();
      }
    }, [isSectionInViewport]);

    /* =====================================================
    CUSTOM CURSOR LERP

    Cursor is rendered inside the card.

    IMPORTANT:
    pointer-events-none means the cursor
    can NEVER interfere with the video.
    ===================================================== */

    useEffect(() => {
      if (!isVideo || !isSectionInViewport) return;

      // Custom cursor is desktop/tablet only.
      if (window.innerWidth < 768) {
        return;
      }

      const animateCursor = () => {
        currentX.current += (targetX.current - currentX.current) * 0.12;

        currentY.current += (targetY.current - currentY.current) * 0.12;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(
          ${currentX.current}px,
          ${currentY.current}px,
          0
        ) translate(-50%, -50%)`;
        }

        animationRef.current = requestAnimationFrame(animateCursor);
      };

      animationRef.current = requestAnimationFrame(animateCursor);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isVideo, isSectionInViewport]);

    /* =====================================================
    GLOBAL CURSOR DETECTION

    THIS IS THE IMPORTANT FIX.

    We do NOT rely on mouseenter.

    If GSAP moves the card underneath
    a stationary mouse, getBoundingClientRect()
    will detect that the mouse is now inside
    the card.

    CHANGED:
    The element is now found by item.id.
    ===================================================== */

    useEffect(() => {
      if (!isVideo || !isSectionInViewport) return;

      // No custom cursor logic on mobile.
      if (window.innerWidth < 768) {
        return;
      }

      const mediaElement = mediaRef.current;

      if (!mediaElement) {
        return;
      }

      const handleGlobalMouseMove = (event) => {
        const rect = mediaElement.getBoundingClientRect();

        const isInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (isInside) {
          const x = event.clientX - rect.left;

          const y = event.clientY - rect.top;

          targetX.current = x;
          targetY.current = y;

          if (!isHoveredRef.current) {
            currentX.current = x;
            currentY.current = y;

            isHoveredRef.current = true;
            setIsHovered(true);
          }
        } else if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
      };

      window.addEventListener("mousemove", handleGlobalMouseMove, {
        passive: true,
      });

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);

        isHoveredRef.current = false;
      };
    }, [isVideo, itemId, isSectionInViewport]);

    /* =====================================================
    EXTRA CHECK AFTER SCROLL

    This fixes the exact situation where
    the card moves under a stationary mouse
    without mousemove firing.

    CHANGED:
    Element is located by item.id.
    ===================================================== */

    useEffect(() => {
      if (!isVideo || !isSectionInViewport) return;

      // This effect is only needed for desktop
      // because it fixes the custom cursor when
      // GSAP moves a card under a stationary mouse.
      if (window.innerWidth < 768) {
        return;
      }

      let frameId = null;

      const checkCursorPosition = () => {
        const mediaElement = mediaRef.current;

        const mouseX = window.__rotationMouseX;

        const mouseY = window.__rotationMouseY;

        if (
          !mediaElement ||
          typeof mouseX !== "number" ||
          typeof mouseY !== "number"
        ) {
          frameId = requestAnimationFrame(checkCursorPosition);

          return;
        }

        const rect = mediaElement.getBoundingClientRect();

        const isInside =
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom;

        if (isInside) {
          const x = mouseX - rect.left;

          const y = mouseY - rect.top;

          targetX.current = x;
          targetY.current = y;

          if (!isHoveredRef.current) {
            currentX.current = x;
            currentY.current = y;

            isHoveredRef.current = true;
            setIsHovered(true);
          }
        } else if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }

        frameId = requestAnimationFrame(checkCursorPosition);
      };

      frameId = requestAnimationFrame(checkCursorPosition);

      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }, [isVideo, itemId, isSectionInViewport]);

    /* =====================================================
    IMAGE CLICK
    ===================================================== */

    const handleImageClick = (event) => {
      event.preventDefault();

      event.stopPropagation();

      /*
       * CHANGED:
       * Send ID.
       */
      onImageClick(itemId);
    };

    /* =====================================================
    VIDEO CLICK
    ===================================================== */

    const handleVideoClick = (event) => {
      event.preventDefault();

      event.stopPropagation();

      /*
       * CHANGED:
       * Send ID.
       */
      onVideoClick(itemId);
    };

    /* =====================================================
    RENDER
    ===================================================== */

    return (
      <div
        ref={ref}
        className="
          absolute
          h-[50vh]
          w-[38vw]
          origin-right
          overflow-hidden
          rounded-[24px]
          bg-black
          opacity-0
          max-[1025px]:h-[50vh]
          max-[1025px]:w-[50vw]
          max-md:h-[50vh]
          max-md:w-[75vw]
        "
        style={{
          transformStyle: "preserve-3d",

          /*
           * IMPORTANT:
           *
           * z-index remains index based
           * because this is visual/render order,
           * NOT item identity.
           */
          zIndex: isActive ? 1000 : 100 + (total - index),
        }}
      >
        {/* =================================================
        MEDIA CONTAINER
        ================================================= */}

        <div
          /*
           * CHANGED:
           *
           * data attribute now uses ID.
           */
          ref={mediaRef}
          data-rotation-video={isVideo ? itemId : undefined}
          className="
            relative
            h-full
            w-full
            overflow-hidden
          "
        >
          {/* ===============================================
          VIDEO
          =============================================== */}

          {isVideo ? (
            <>
              <video
                ref={videoRef}
                src={src}
                muted={true}
                loop={item?.loop ?? videoLoop}
                playsInline={item?.playsInline ?? videoPlaysInline}
                preload="metadata"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  cursor-none
                  select-none
                  object-cover
                  touch-manipulation
                  pointer-events-auto
                "
                onClick={handleVideoClick}
              />

              {/* =========================================
              DESKTOP CUSTOM CURSOR
              ========================================= */}

              <div
                ref={cursorRef}
                className={`
                  pointer-events-none
                  absolute
                  left-0
                  top-0
                  z-[100]
                  hidden
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/70
                  bg-black/30
                  text-white
                  backdrop-blur-md
                  transition-opacity
                  duration-200
                  md:flex
                  ${isHovered ? "opacity-100" : "opacity-0"}
                `}
              >
                {isPlaying ? (
                  <Pause
                    className="
                      h-5
                      w-5
                      fill-white
                    "
                    strokeWidth={1.5}
                  />
                ) : (
                  <Play
                    className="
                      ml-0.5
                      h-5
                      w-5
                      fill-white
                    "
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* =========================================
              MOBILE PLAY / PAUSE
              ========================================= */}

              <button
                type="button"
                aria-label={isPlaying ? "Pause video" : "Play video"}
                onClick={handleVideoClick}
                className="
                  absolute
                  bottom-4
                  left-1/2
                  z-[200]
                  flex
                  h-12
                  w-12
                  -translate-x-1/2
                  touch-manipulation
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  bg-black/70
                  text-white
                  shadow-xl
                  backdrop-blur-md
                  transition-transform
                  active:scale-90
                  md:hidden
                "
              >
                {isPlaying ? (
                  <Pause
                    className="
                      h-4
                      w-4
                      fill-white
                    "
                    strokeWidth={1.5}
                  />
                ) : (
                  <Play
                    className="
                      ml-0.5
                      h-4
                      w-4
                      fill-white
                    "
                    strokeWidth={1.5}
                  />
                )}
              </button>
            </>
          ) : (
            /* =============================================
            IMAGE
            ============================================= */

            <img
              src={src}
              alt={item?.alt || `Slide ${index + 1}`}
              draggable={false}
              onClick={handleImageClick}
              className="
                absolute
                inset-0
                h-full
                w-full
                cursor-pointer
                select-none
                object-cover
                touch-manipulation
                transition-transform
                duration-700
              "
            />
          )}
        </div>

        {/* =================================================
        CAPTION
        ================================================= */}

        {showCaptions && caption && (
          <div
            className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                z-[50]
                -translate-x-1/2
                -translate-y-1/2
                whitespace-nowrap
                text-center
                text-[1.4vw]
                font-medium
                max-[1025px]:text-[2.4vw]
                max-md:text-[4vw]
              "
            style={{
              color: textColor,

              textShadow:
                "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
            }}
          >
            {caption}
          </div>
        )}
      </div>
    );
  },
);

RotationCard.displayName = "RotationCard";
