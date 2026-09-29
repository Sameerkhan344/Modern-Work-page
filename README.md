// Built using Hyperiux Vault: [https://vault.hyperiux.com](https://vault.hyperiux.com)
// Installed Effect:rotation-slider

# Polish / Perfection — Circular 3D Work Slider

A clean Next.js Pages Router starter for an awards-style work page.

## Stack

- Next.js 15.5.25
- React 19
- GSAP 3
- Tailwind CSS 4
- CSS 3D transforms
- Native HTML5 videos

## Important

This project intentionally uses the **Pages Router** (`src/pages`) rather than the App Router.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production:

```bash
npm run build
npm start
```

## Add your videos

Put your real videos here:

```text
public/videos/project-01.mp4
public/videos/project-02.mp4
...
public/videos/project-06.mp4
```

The starter includes SVG poster placeholders so the page still renders before videos are added.

## Change project content

Edit:

```text
src/data/projects.js
```

Each item supports:

- title
- subtitle
- description
- video
- poster
- accent

## Interaction

- Mouse wheel / trackpad changes the active project
- Horizontal wheel delta is supported
- Touch swipe works on mobile
- Arrow keys work on desktop
- Previous / next buttons work everywhere
- Active video plays muted
- Inactive videos pause and use `preload="none"`
- Circular index wrapping means there is no hard end
- GSAP controls the 3D depth, rotation, scale, opacity and blur

## Architecture

```text
src/
  components/
    AwardsWork.jsx
    CircularProjectSlider.jsx
    ProjectVideo.jsx
  data/
    projects.js
  pages/
    _app.jsx
    index.jsx
  styles/
    globals.css
public/
  images/
  videos/
```

## Why CSS 3D instead of Three.js here?

For this particular carousel, CSS 3D + GSAP is considerably lighter than rendering every video texture through WebGL. It also avoids WebGL context loss, video-texture memory pressure and mobile GPU issues.

Three.js/R3F can still be added later for a separate liquid hover layer without replacing the slider architecture.
