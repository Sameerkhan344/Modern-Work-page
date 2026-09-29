import SmoothScroll from "@/components/SmoothScroll";
import "@/styles/globals.css";
// import "@/styles/BendCarousel.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SmoothScroll />
      <Component {...pageProps} />
    </>
  );
}
