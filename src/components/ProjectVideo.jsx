import { useEffect, useRef, useState } from "react";

export default function ProjectVideo({ src, poster, active, title }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      const promise = video.play();
      if (promise?.catch) promise.catch(() => {});
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <div className="project-media">
      {!failed ? (
        <video
          ref={videoRef}
          className="project-video"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={active ? "metadata" : "none"}
          onError={() => setFailed(true)}
          aria-label={title}
        />
      ) : (
        <img className="project-video project-poster" src={poster} alt="" />
      )}

      <div className="media-sheen" aria-hidden="true" />
      <div className="play-mark" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
