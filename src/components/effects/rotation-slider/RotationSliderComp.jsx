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
import { Draggable } from "gsap/Draggable";

import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  VolumeX,
  Volume2,
} from "lucide-react";
// import PolishPerfectionSection from "@/components/PolishPerfectionSection";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

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
GLOBAL VIDEO STOP
=========================================================

Each category has its own videosRef. When the user enters a new
category, stopping only the current component's ref can leave the
previous category's video playing.

This helper intentionally works across all RotationSliderComp
instances without changing the UI.
========================================================= */

function stopAllRotationSliderVideos(exceptVideo = null) {
  if (typeof document === "undefined") {
    return;
  }

  document
    .querySelectorAll("video[data-rotation-slider-video]")
    .forEach((video) => {
      if (video !== exceptVideo) {
        video.pause();
      }
    });
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

  // Mobile uses buttons + drag only. Native wheel/trackpad scrolling is disabled.
  const mobileDraggableRef = useRef(null);

  // The animation engine is created only while this category is
  // actually inside the viewport. This prevents all categories
  // from initializing their ScrollTriggers on page load.
  const [isInViewport, setIsInViewport] = useState(false);
  const [isAnimationInitialized, setIsAnimationInitialized] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const isInViewportRef = useRef(false);
  const animationInitializedRef = useRef(false);

  const reducedMotion = prefersReducedMotion();

  /*
   * CHANGED:
   *
   * Active item is identified by ID.
   */
  const [activeId, setActiveId] = useState(images[0]?.id ?? null);
  const activeIdRef = useRef(images[0]?.id ?? null);

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

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

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
  STOP ALL VIDEOS IN THIS CATEGORY

  Used when this category leaves the viewport.
  This is intentionally independent of playingId so the
  actual HTMLVideoElement is always paused.
  ======================================================= */

  const stopAllVideos = useCallback(() => {
    Object.values(videosRef.current).forEach((video) => {
      if (!video) return;

      video.pause();
    });

    setPlayingId(null);
    pendingVideoPlayIdRef.current = null;
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
        // IMPORTANT: play/pause must never change the user's volume choice.
        // Keep the current mute state when the video is played again.
        const shouldMute =
          typeof video.__rotationSliderMuted === "boolean"
            ? video.__rotationSliderMuted
            : false;

        video.muted = shouldMute;

        if (!shouldMute) {
          video.volume = 1;
        }

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
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(outer);

    return () => {
      observer.disconnect();
      isInViewportRef.current = false;
    };
  }, [stopAllVideos]);

  /* =======================================================
  CROSS-CATEGORY VIDEO SAFETY
  ======================================================= */

  useEffect(() => {
    const handleCategoryScroll = () => {
      const outer = outerRef.current;

      if (!outer) {
        return;
      }

      const rect = outer.getBoundingClientRect();

      /*
       * If this category is completely outside the real viewport,
       * its videos must not continue playing.
       */
      const outside = rect.bottom <= 0 || rect.top >= window.innerHeight;

      if (outside) {
        stopAllVideos();
      }

      /*
       * If this category has entered the viewport, stop videos from
       * other RotationSliderComp categories. This creates a reliable
       * handoff even when IntersectionObserver callbacks arrive later.
       */
      if (!outside) {
        stopAllRotationSliderVideos();
      }
    };

    handleCategoryScroll();

    window.addEventListener("scroll", handleCategoryScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleCategoryScroll);

    return () => {
      window.removeEventListener("scroll", handleCategoryScroll);
      window.removeEventListener("resize", handleCategoryScroll);
    };
  }, [stopAllVideos]);

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
      // Mobile is a true 100vh slider section.
      // The cards move horizontally by drag/buttons only.
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        outer.style.height = `${window.innerHeight}px`;
        return;
      }

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

      /*
       * MOBILE:
       * Do NOT create a ScrollTrigger-driven horizontal slider.
       * The mobile section is exactly 100vh and the cards move only
       * through drag/swipe and the navigation buttons.
       */
      const isMobileViewport = window.innerWidth < MOBILE_BREAKPOINT;

      if (isMobileViewport) {
        gsap.set(track, { x: 0 });

        const snapToNearestSlide = () => {
          const viewportCenter = window.innerWidth / 2;

          let closestIndex = 0;
          let closestDistance = Infinity;

          wrappersRef.current.forEach((wrapper, index) => {
            if (!wrapper) return;

            const rect = wrapper.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const distance = Math.abs(center - viewportCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          const targetWrapper = wrappersRef.current[closestIndex];

          if (!targetWrapper) return;

          const rect = targetWrapper.getBoundingClientRect();
          const difference =
            window.innerWidth / 2 - (rect.left + rect.width / 2);

          const currentX = gsap.getProperty(track, "x") || 0;
          const targetX = gsap.utils.clamp(
            -getTravel(),
            0,
            Number(currentX) + difference,
          );

          gsap.to(track, {
            x: targetX,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
            onComplete: () => {
              const targetItem = images[closestIndex];

              if (targetItem) {
                setActiveId(targetItem.id);
                activeIdRef.current = targetItem.id;

                if (
                  String(previousActiveIdRef.current) !== String(targetItem.id)
                ) {
                  const previousVideo =
                    videosRef.current[previousActiveIdRef.current];

                  previousVideo?.pause();
                  previousActiveIdRef.current = targetItem.id;
                  setPlayingId((current) =>
                    String(current) === String(previousActiveIdRef.current)
                      ? current
                      : null,
                  );
                }
              }
            },
          });
        };

        mobileDraggableRef.current?.kill();

        mobileDraggableRef.current = Draggable.create(track, {
          type: "x",
          bounds: () => ({
            minX: -getTravel(),
            maxX: 0,
          }),
          allowNativeTouchScrolling: true,
          minimumMovement: 5,
          cursor: "grab",
          activeCursor: "grabbing",
          onPress: function () {
            gsap.killTweensOf(track);
          },
          onRelease: function () {
            snapToNearestSlide();
          },
        })[0];

        horizontalTweenRef.current = null;

        cardsRef.current.forEach((card) => {
          if (!card) return;

          gsap.set(card, {
            rotateY: 0,
            rotateX: 0,
            opacity: 1,
            y: 0,
          });
        });

        requestAnimationFrame(() => {
          snapToNearestSlide();
        });

        return;
      }

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

        /*
         * MOBILE:
         * Keep slides completely normal/flat.
         * No perspective rotation, no vertical drift and no opacity
         * transition from the 3D card animation.
         *
         * Desktop/tablet behavior remains unchanged.
         */
        if (isMobile) {
          gsap.set(card, {
            rotateY: 0,
            rotateX: 0,
            opacity: 1,
            y: 0,
          });

          return;
        }

        const total = images.length;

        const mid = Math.floor(total / 2);

        const step = (isTablet ? TABLET_STEP : DESKTOP_STEP) * verticalDrift;

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

      mobileDraggableRef.current?.kill();
      mobileDraggableRef.current = null;

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
    layoutVersion,
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

      /*
       * MOBILE:
       * Center the requested card directly with a transform.
       * There is intentionally no ScrollTrigger/page-scroll dependency.
       */
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        const track = trackRef.current;
        const wrapper = wrappersRef.current[index];

        if (!track || !wrapper) {
          return;
        }

        gsap.killTweensOf(track);

        const rect = wrapper.getBoundingClientRect();
        const difference = window.innerWidth / 2 - (rect.left + rect.width / 2);

        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        const travel = Math.max(0, track.scrollWidth - window.innerWidth);

        const targetX = gsap.utils.clamp(-travel, 0, currentX + difference);

        setActiveId(id);
        activeIdRef.current = id;

        gsap.to(track, {
          x: targetX,
          duration: reducedMotion ? 0 : 0.55,
          ease: "power3.inOut",
          overwrite: true,
          onComplete: () => {
            const previousId = previousActiveIdRef.current;

            if (String(previousId) !== String(id)) {
              videosRef.current[previousId]?.pause();
              setPlayingId((current) =>
                String(current) === String(previousId) ? null : current,
              );
              previousActiveIdRef.current = id;
            }
          },
        });

        return;
      }

      const wrapper = wrappersRef.current[index];

      const horizontalTween = horizontalTweenRef.current;

      const scrollTrigger = horizontalTween?.scrollTrigger;

      if (!wrapper || !scrollTrigger) {
        return;
      }

      /*
       * IMPORTANT:
       *
       * Calculate the navigation position from the card's STATIC position
       * inside the horizontal track, not from getBoundingClientRect().
       *
       * getBoundingClientRect() can be one frame behind while ScrollTrigger
       * is scrubbing the horizontal tween. That is why the first click could
       * land on the old position and the second click would appear to fix it.
       *
       * The track moves from 0 to -travel. So we can calculate exactly which
       * ScrollTrigger progress puts this card in the viewport center.
       */
      const track = trackRef.current;

      if (!track) {
        return;
      }

      ScrollTrigger.update();

      const travel = Math.max(0, track.scrollWidth - window.innerWidth);

      const wrapperCenterInTrack = wrapper.offsetLeft + wrapper.offsetWidth / 2;

      const viewportCenter = window.innerWidth / 2;

      let targetProgress =
        travel > 0 ? (wrapperCenterInTrack - viewportCenter) / travel : 0;

      targetProgress = Math.max(0, Math.min(1, targetProgress));

      const targetScroll =
        scrollTrigger.start +
        targetProgress * (scrollTrigger.end - scrollTrigger.start);

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

        /*
         * Immediately synchronize ScrollTrigger with the new position.
         * This prevents the first navigation click from leaving the active
         * slide one step behind.
         */
        requestAnimationFrame(() => {
          ScrollTrigger.update();
        });

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
  RESPONSIVE RESIZE / BREAKPOINT CHANGE
  ======================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let resizeTimer = null;
    let previousWidth = window.innerWidth;
    let previousMobile = window.innerWidth < MOBILE_BREAKPOINT;

    const handleResponsiveResize = () => {
      window.clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        const currentWidth = window.innerWidth;
        const currentMobile = currentWidth < MOBILE_BREAKPOINT;

        const crossedBreakpoint = currentMobile !== previousMobile;

        const widthChanged = Math.abs(currentWidth - previousWidth) > 1;

        previousWidth = currentWidth;
        previousMobile = currentMobile;

        if (!widthChanged && !crossedBreakpoint) {
          return;
        }

        /*
         * When switching between mobile/tablet/desktop, the GSAP context
         * itself must be rebuilt because card rotation, spacing and mobile
         * drag behavior are created from window.innerWidth.
         */
        if (crossedBreakpoint) {
          mobileDraggableRef.current?.kill();
          mobileDraggableRef.current = null;

          setLayoutVersion((version) => version + 1);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
            });
          });

          return;
        }

        /*
         * Recalculate the section height first.
         * This is especially important when switching between
         * mobile (100dvh) and desktop/tablet layouts.
         */
        const outer = outerRef.current;
        const track = trackRef.current;

        if (outer && track) {
          if (currentMobile) {
            const viewportHeight =
              window.visualViewport?.height || window.innerHeight;

            outer.style.height = `${viewportHeight}px`;
            outer.style.minHeight = `${viewportHeight}px`;
          } else {
            const travel = Math.max(0, track.scrollWidth - window.innerWidth);

            outer.style.height = `${travel + window.innerHeight}px`;
            outer.style.minHeight = "";
          }
        }

        /*
         * Kill the mobile draggable when leaving mobile.
         * It will be recreated by the GSAP layout effect after
         * the breakpoint changes.
         */
        if (!currentMobile) {
          mobileDraggableRef.current?.kill();
          mobileDraggableRef.current = null;
        }

        /*
         * Wait one frame so CSS breakpoints and dimensions have
         * actually been applied before refreshing ScrollTrigger.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();

            /*
             * Keep the currently active slide centered after
             * a breakpoint/layout change.
             */
            const currentActiveId = activeIdRef.current;

            if (currentActiveId !== null && isInViewportRef.current) {
              requestAnimationFrame(() => {
                centerSlide(currentActiveId);
              });
            }
          });
        });
      }, 120);
    };

    window.addEventListener("resize", handleResponsiveResize, {
      passive: true,
    });

    window.visualViewport?.addEventListener("resize", handleResponsiveResize, {
      passive: true,
    });

    return () => {
      window.clearTimeout(resizeTimer);

      window.removeEventListener("resize", handleResponsiveResize);

      window.visualViewport?.removeEventListener(
        "resize",
        handleResponsiveResize,
      );
    };
  }, [centerSlide]);

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

      setPlayingId(null);
      pendingVideoPlayIdRef.current = null;

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
      className="relative w-full max-md:min-h-[100dvh] max-md:h-[100dvh]"
    >
      <div
        className="sticky top-0 flex h-screen w-full items-center overflow-hidden max-md:h-[100dvh]"
        style={{
          perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px`,
        }}
      >
        {/* =================================================
        HORIZONTAL TRACK
        ================================================= */}

        <div
          ref={trackRef}
          className="pointer-events-none flex h-full items-center gap-[5vw] pl-[31vw] pr-[31vw] will-change-transform max-[1025px]:gap-[8vw] max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw] max-md:gap-[12vw] max-md:pl-[12.5vw] max-md:pr-[12.5vw]
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
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:scale-100
            disabled:active:scale-100
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
    const [isMuted, setIsMuted] = useState(false);
    const mutedRef = useRef(false);
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

      // Video is initially paused.
      // Volume starts ON, so the initial icon is Volume2.
      mutedRef.current = false;
      video.__rotationSliderMuted = false;
      video.muted = false;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      const tryIOSPlay = () => {
        const promise = video.play();
        if (promise?.catch) promise.catch(() => {});
      };

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
    VIDEO SOUND TOGGLE

    This controls ONLY mute/unmute.
    It never changes play/pause state.
    ===================================================== */

    const handleMuteToggle = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const video = videoRef.current;

      if (!video) return;

      // Keep the user's volume choice independent from play/pause.
      const nextMuted = !mutedRef.current;

      mutedRef.current = nextMuted;
      video.__rotationSliderMuted = nextMuted;
      video.muted = nextMuted;

      if (!nextMuted) {
        video.volume = 1;
      }

      // Volume button changes only audio/icon state.
      // It never plays or pauses the video.
      setIsMuted(nextMuted);
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
        max-md:pointer-events-auto
          absolute
          h-[60vh]
          w-[40vw]
          origin-right
          overflow-hidden
          rounded-[24px]
          bg-black
          opacity-0
          max-[1025px]:h-[60vh]
          max-[1025px]:w-[50vw]
          max-md:h-[60vh]
          max-md:w-[85vw]
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
          data-rotation-slider-video={isVideo ? "true" : undefined}
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
                loop={item?.loop ?? videoLoop}
                playsInline={item?.playsInline ?? videoPlaysInline}
                muted
                autoPlay
                preload="auto"
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
              MOBILE VIDEO CONTROLS

              Play/Pause and Volume are completely separate.
              Volume never calls play() or pause().
              ========================================= */}

              <div
                className="
                  absolute
                  bottom-4
                  left-1/2
                  z-[200]
                  flex
                  -translate-x-1/2
                  items-center
                  gap-2
                  md:hidden
                "
              >
                {/* PLAY / PAUSE */}
                <button
                  type="button"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  onClick={handleVideoClick}
                  className="
                    flex
                    h-12
                    w-12
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
                  "
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-white" strokeWidth={1.5} />
                  ) : (
                    <Play
                      className="ml-0.5 h-4 w-4 fill-white"
                      strokeWidth={1.5}
                    />
                  )}
                </button>

                {/* VOLUME ON / OFF */}
                <button
                  type="button"
                  aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
                  aria-pressed={!isMuted}
                  onClick={handleMuteToggle}
                  className="
                    flex
                    h-12
                    w-12
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
                  "
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Volume2 className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
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
