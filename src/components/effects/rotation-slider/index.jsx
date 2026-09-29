// // Built using Hyperiux Vault: https://vault.hyperiux.com
// import { RotationSliderComp } from "./RotationSliderComp";
// export default function RotationSlider({
//   rotationAmount = 1,
//   verticalDrift = 1,
//   scrollSmoothing = 1,
//   perspective = 1200,
//   showCaptions = true,
//   textColor = "#ffffff",
// }) {
//   const images = [
//     {
//       src: "https://framerusercontent.com/assets/eNZc5nusNy1lO0nGOfz0GamkGw.mp4",
//       text: "Initialize Motion Layer",
//     },
//     {
//       src: "https://framerusercontent.com/assets/dClAqDx2W8igpK6WWr06wAwO54.mp4",
//       text: "Inject Depth Matrix",
//     },
//     {
//       src: "https://framerusercontent.com/assets/TaJcPCEBAS9WMr1q5rVFtrP3pBg.mp4",
//       text: "Sync Scroll Engine",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
//       text: "Calibrate Perspective",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
//       text: "Activate 3D Pipeline",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg",
//       text: "Bind Interaction Core",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-07.jpg",
//       text: "Compute Visual Flow",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-08.jpg",
//       text: "Render Adaptive Frames",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-09.jpg",
//       text: "Stabilize Motion Curve",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-10.jpg",
//       text: "Optimize Transition Graph",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg",
//       text: "Deploy Experience Layer",
//     },
//     {
//       src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg",
//       text: "Finalize Hyperiux State",
//     },
//   ];
//   return (
//     <>
//       <RotationSliderComp
//         images={images}
//         rotationAmount={rotationAmount}
//         verticalDrift={verticalDrift}
//         scrollSmoothing={scrollSmoothing}
//         perspective={perspective}
//         showCaptions={showCaptions}
//         textColor={textColor}
//         videoMuted={true}
//         videoLoop={true}
//         videoPlaysInline={true}
//       />
//     </>
//   );
// }

"use client";

import PolishPerfectionSection from "@/components/PolishPerfectionSection";
import { RotationSliderComp } from "./RotationSliderComp";

export default function Cartegoryy({
  rotationAmount = 1,
  verticalDrift = 1,
  scrollSmoothing = 1,
  perspective = 1200,
  showCaptions = true,
  textColor = "#ffffff",
}) {
  const data = [
    {
      id: 1,
      src: "https://framerusercontent.com/assets/eNZc5nusNy1lO0nGOfz0GamkGw.mp4",
      text: "Initialize Motion Layer",
      type: "video",
    },

    {
      id: 2,
      src: "https://framerusercontent.com/assets/dClAqDx2W8igpK6WWr06wAwO54.mp4",
      text: "Inject Depth Matrix",
      type: "video",
    },

    {
      id: 3,
      src: "https://framerusercontent.com/assets/TaJcPCEBAS9WMr1q5rVFtrP3pBg.mp4",
      text: "Sync Scroll Engine",
      type: "video",
    },

    {
      id: 4,
      src: "https://framerusercontent.com/assets/0dRCNm9wYibzP41y7mwHUVfhmms.mp4",
      text: "Calibrate Perspective",
      type: "video",
    },

    {
      id: 5,
      src: "https://framerusercontent.com/assets/TaJcPCEBAS9WMr1q5rVFtrP3pBg.mp4",
      text: "Activate 3D Pipeline",
      type: "video",
    },

    {
      id: 6,
      src: "https://framerusercontent.com/assets/3CvdFN2Ry2mNA2q9ZAM4Kra10.mp4",
      text: "Bind Interaction Core",
      type: "video",
    },

    {
      id: 7,
      src: "https://framerusercontent.com/assets/kIwrCeqgD9SObHctOXjjidYIge4.mp4",
      text: "Compute Visual Flow",
      type: "video",
    },

    {
      id: 8,
      src: "https://framerusercontent.com/assets/Qdmz44JgSZCrVzZrU27R6LRrkPM.mp4",
      text: "Render Adaptive Frames",
      type: "video",
    },
    {
      id: 9,
      src: "https://framerusercontent.com/assets/eNZc5nusNy1lO0nGOfz0GamkGw.mp4",
      text: "Initialize Motion Layer",
      type: "video",
    },

    {
      id: 10,
      src: "https://framerusercontent.com/assets/dClAqDx2W8igpK6WWr06wAwO54.mp4",
      text: "Inject Depth Matrix",
      type: "video",
    },
  ];

  return (
    <div className="bg-[#dadada]">
      <PolishPerfectionSection
        title="Our polish perfection edit"
        subtitle="Full service + Production"
        description="Research, scheduling, personalisation, personal brand manager"
      />
      <RotationSliderComp
        images={data}
        rotationAmount={rotationAmount}
        verticalDrift={verticalDrift}
        scrollSmoothing={scrollSmoothing}
        perspective={perspective}
        showCaptions={showCaptions}
        textColor={textColor}
        videoMuted={true}
        videoLoop={true}
        videoPlaysInline={true}
      />
    </div>
  );
}
