import CircularProjectSlider from "./CircularProjectSlider";

export default function WorkSection({ project }) {
  return (
    <section className="project-section">
      <div className="project-heading">
        <div className="eyebrow">01 — Work / Case study</div>
        <h1>{project.title}</h1>
        <div className="project-subtitle">{project.subtitle}</div>
        <p>{project.description}</p>
      </div>
      {/* <CircularProjectSlider projects={[project]} /> */}
      <ThreeCircularProjectSlider projects={projects} />
    </section>
  );
}
