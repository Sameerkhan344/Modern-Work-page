// "use client";

// import PolishPerfectionSection from "./PolishPerfectionSection";
// import { RotationSliderComp } from "./effects/rotation-slider/RotationSliderComp";

// export default function Cartegory({
//   title,
//   subtitle,
//   description,
//   data = [],

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
//   return (
//     <section className="bg-[#dadada]">
//       <PolishPerfectionSection
//         title={title}
//         subtitle={subtitle}
//         description={description}
//       />

//       <RotationSliderComp
//         images={data}
//         rotationAmount={rotationAmount}
//         verticalDrift={verticalDrift}
//         scrollSmoothing={scrollSmoothing}
//         perspective={perspective}
//         showCaptions={showCaptions}
//         textColor={textColor}
//         videoMuted={videoMuted}
//         videoLoop={videoLoop}
//         videoPlaysInline={videoPlaysInline}
//       />
//     </section>
//   );
// }


// "use client";

// import PolishPerfectionSection from "./PolishPerfectionSection";
// import { RotationSliderComp } from "./effects/rotation-slider/RotationSliderComp";

// export default function Cartegory({
//   title,
//   subtitle,
//   description,
//   data = [],
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
//   return (
//     <section className="relative bg-[#dadada]">
//       <PolishPerfectionSection
//         title={title}
//         subtitle={subtitle}
//         description={description}
//       />

//       <RotationSliderComp
//         images={data}
//         rotationAmount={rotationAmount}
//         verticalDrift={verticalDrift}
//         scrollSmoothing={scrollSmoothing}
//         perspective={perspective}
//         showCaptions={showCaptions}
//         textColor={textColor}
//         videoMuted={videoMuted}
//         videoLoop={videoLoop}
//         videoPlaysInline={videoPlaysInline}
//       />
//     </section>
//   );
// }


"use client";

import PolishPerfectionSection from "./PolishPerfectionSection";
import { RotationSliderComp } from "./effects/rotation-slider/RotationSliderComp";

export default function Cartegory({
  id,
  title,
  subtitle,
  description,
  data = [],

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
  return (
    <section
      data-category-id={id}
      className="bg-[#dadada]"
    >
      <PolishPerfectionSection
        title={title}
        subtitle={subtitle}
        description={description}
      />

      <RotationSliderComp
        categoryId={id}
        images={data}
        rotationAmount={rotationAmount}
        verticalDrift={verticalDrift}
        scrollSmoothing={scrollSmoothing}
        perspective={perspective}
        showCaptions={showCaptions}
        textColor={textColor}
        videoMuted={videoMuted}
        videoLoop={videoLoop}
        videoPlaysInline={videoPlaysInline}
      />
    </section>
  );
}

