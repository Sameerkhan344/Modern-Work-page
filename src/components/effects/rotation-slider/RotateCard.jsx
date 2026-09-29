
"use client";

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * RotateCard
 *
 * Responsibilities:
 * - Render a single rotation slider card
 * - Handle video registration
 * - Handle custom cursor
 * - Handle hover / mouse movement
 * - Handle video click
 * - Handle image/card click
 *
 * Animation / GSAP positioning stays inside RotationSliderComp.
 * This keeps the card component lightweight.
 */

const RotateCard = forwardRef(function RotateCard(
  {
    categoryId,
    item,
    index,
    total,

    isActive = false,
    isPlaying = false,

    isSectionInViewport = false,

    showCaptions = true,
    textColor = "#ffffff",

    videoMuted = true,
    videoLoop = true,
    videoPlaysInline = true,

    onRegisterVideo,
    onImageClick,
    onVideoClick,

    className = "",
  },
  forwardedRef,
) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  const cursorRef = useRef(null);

  const animationFrameRef = useRef(null);

  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  const targetXRef = useRef(0);
  const targetYRef = useRef(0);

  const isHoveringRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);

  /**
   * ---------------------------------------------------------
   * UNIQUE CARD ID
   * ---------------------------------------------------------
   *
   * Example:
   *
   * polish-perfection-1
   * creative-direction-1
   * brand-strategy-1
   *
   * This prevents querySelector collisions between categories.
   */
  const uniqueCardId = useMemo(() => {
    return `${categoryId}-${item?.id}`;
  }, [categoryId, item?.id]);

  const isVideo = item?.type === "video";

  /**
   * ---------------------------------------------------------
   * MERGE FORWARDED REF
   * ---------------------------------------------------------
   */

  const setCardRef = useCallback(
    (node) => {
      cardRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  /**
   * ---------------------------------------------------------
   * REGISTER VIDEO
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isVideo) return;

    const video = videoRef.current;

    if (!video) return;

    onRegisterVideo?.(item.id, video);

    return () => {
      /**
       * Don't remove the video from the parent map here.
       * The parent controls the complete video lifecycle.
       */
    };
  }, [isVideo, item?.id, onRegisterVideo]);

  /**
   * ---------------------------------------------------------
   * VIDEO CONFIGURATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isVideo) return;

    video.muted = videoMuted;
    video.loop = videoLoop;
    video.playsInline = videoPlaysInline;

    /**
     * Important:
     *
     * We don't automatically play every video.
     * RotationSliderComp controls which video should play.
     */
  }, [
    isVideo,
    videoMuted,
    videoLoop,
    videoPlaysInline,
  ]);

  /**
   * ---------------------------------------------------------
   * STOP VIDEO WHEN SECTION IS FAR AWAY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isVideo) return;

    if (!isSectionInViewport) {
      video.pause();
    }
  }, [isSectionInViewport, isVideo]);

  /**
   * ---------------------------------------------------------
   * CUSTOM CURSOR ANIMATION
   * ---------------------------------------------------------
   *
   * Only one RAF exists for this card.
   *
   * It is completely stopped when:
   *
   * - card isn't hovered
   * - section isn't near viewport
   * - component unmounts
   */
  const stopCursorAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const animateCursor = useCallback(() => {
    if (!isHoveringRef.current) {
      stopCursorAnimation();
      return;
    }

    if (!isSectionInViewport) {
      stopCursorAnimation();
      return;
    }

    const cursor = cursorRef.current;

    if (!cursor) {
      stopCursorAnimation();
      return;
    }

    mouseXRef.current +=
      (targetXRef.current - mouseXRef.current) * 0.16;

    mouseYRef.current +=
      (targetYRef.current - mouseYRef.current) * 0.16;

    cursor.style.transform = `
      translate3d(
        ${mouseXRef.current}px,
        ${mouseYRef.current}px,
        0
      )
      translate(-50%, -50%)
    `;

    animationFrameRef.current =
      requestAnimationFrame(animateCursor);
  }, [
    isSectionInViewport,
    stopCursorAnimation,
  ]);

  /**
   * ---------------------------------------------------------
   * START CURSOR
   * ---------------------------------------------------------
   */

  const startCursorAnimation = useCallback(() => {
    if (!isSectionInViewport) return;

    if (animationFrameRef.current) return;

    animationFrameRef.current =
      requestAnimationFrame(animateCursor);
  }, [
    animateCursor,
    isSectionInViewport,
  ]);

  /**
   * ---------------------------------------------------------
   * MOUSE ENTER
   * ---------------------------------------------------------
   */

  const handleMouseEnter = useCallback(
    (event) => {
      if (!isSectionInViewport) return;

      isHoveringRef.current = true;

      setIsHovered(true);

      const rect = event.currentTarget.getBoundingClientRect();

      targetXRef.current =
        event.clientX - rect.left;

      targetYRef.current =
        event.clientY - rect.top;

      mouseXRef.current = targetXRef.current;
      mouseYRef.current = targetYRef.current;

      startCursorAnimation();
    },
    [
      isSectionInViewport,
      startCursorAnimation,
    ],
  );

  /**
   * ---------------------------------------------------------
   * MOUSE MOVE
   * ---------------------------------------------------------
   */

  const handleMouseMove = useCallback(
    (event) => {
      if (!isSectionInViewport) return;

      const rect = event.currentTarget.getBoundingClientRect();

      targetXRef.current =
        event.clientX - rect.left;

      targetYRef.current =
        event.clientY - rect.top;

      if (!animationFrameRef.current) {
        startCursorAnimation();
      }
    },
    [
      isSectionInViewport,
      startCursorAnimation,
    ],
  );

  /**
   * ---------------------------------------------------------
   * MOUSE LEAVE
   * ---------------------------------------------------------
   */

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;

    setIsHovered(false);

    stopCursorAnimation();
  }, [stopCursorAnimation]);

  /**
   * ---------------------------------------------------------
   * CLEANUP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      isHoveringRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current,
        );

        animationFrameRef.current = null;
      }
    };
  }, []);

  /**
   * ---------------------------------------------------------
   * CARD CLICK
   * ---------------------------------------------------------
   */

  const handleCardClick = useCallback(
    (event) => {
      if (isVideo) {
        onVideoClick?.(
          item.id,
          event,
          videoRef.current,
        );

        return;
      }

      onImageClick?.(item.id, event);
    },
    [
      isVideo,
      item?.id,
      onImageClick,
      onVideoClick,
    ],
  );

  /**
   * ---------------------------------------------------------
   * CURSOR VISIBILITY
   * ---------------------------------------------------------
   */

  const cursorVisible =
    isVideo &&
    isHovered &&
    isSectionInViewport;

  return (
    <div
      ref={setCardRef}
      data-rotation-card={uniqueCardId}
      data-rotation-index={index}
      data-rotation-active={
        isActive ? "true" : "false"
      }
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* =====================================================
          MEDIA
      ===================================================== */}

      {isVideo ? (
        <video
          ref={videoRef}
          data-rotation-video={uniqueCardId}
          src={item.src}
          muted={videoMuted}
          loop={videoLoop}
          playsInline={videoPlaysInline}
          preload={
            isSectionInViewport
              ? "metadata"
              : "none"
          }
          className="
            block
            h-full
            w-full
            object-cover
            pointer-events-auto
            select-none
          "
          draggable={false}
        />
      ) : (
        <img
          src={item.src}
          alt={item.text || ""}
          data-rotation-image={uniqueCardId}
          className="
            block
            h-full
            w-full
            object-cover
            pointer-events-auto
            select-none
          "
          draggable={false}
          loading={
            index < 2
              ? "eager"
              : "lazy"
          }
        />
      )}

      {/* =====================================================
          CUSTOM CURSOR
      ===================================================== */}

      {isVideo && (
        <div
          ref={cursorRef}
          data-rotation-cursor={uniqueCardId}
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            left-0
            top-0
            z-50
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-black
            text-white
            transition-[opacity,transform]
            duration-200
            ease-out
            ${
              cursorVisible
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          <span className="text-[10px] uppercase tracking-[0.15em]">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </div>
      )}

      {/* =====================================================
          CAPTION
      ===================================================== */}

      {showCaptions && item?.text && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            z-20
            w-full
            p-4
          "
        >
          <p
            className="
              m-0
              text-sm
              leading-tight
            "
            style={{
              color: textColor,
            }}
          >
            {item.text}
          </p>
        </div>
      )}
    </div>
  );
});

RotateCard.displayName = "RotateCard";

/**
 * ---------------------------------------------------------
 * MEMO
 * ---------------------------------------------------------
 *
 * GSAP changes the card DOM directly.
 * We don't want unrelated slider state updates
 * to cause every card to re-render.
 */
export default memo(
  RotateCard,
  (previous, next) => {
    return (
      previous.categoryId === next.categoryId &&
      previous.item?.id === next.item?.id &&
      previous.item?.src === next.item?.src &&
      previous.item?.text === next.item?.text &&
      previous.item?.type === next.item?.type &&
      previous.index === next.index &&
      previous.total === next.total &&
      previous.isActive === next.isActive &&
      previous.isPlaying === next.isPlaying &&
      previous.isSectionInViewport ===
        next.isSectionInViewport &&
      previous.showCaptions ===
        next.showCaptions &&
      previous.textColor === next.textColor &&
      previous.videoMuted === next.videoMuted &&
      previous.videoLoop === next.videoLoop &&
      previous.videoPlaysInline ===
        next.videoPlaysInline
    );
  },
);

