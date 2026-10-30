import { Reveal } from "./Reveal";
import { useT } from "../i18n";

/* Path of the portrait photo. Until the file exists, a visible
   placeholder is rendered instead. */
const PHOTO: string | undefined = undefined; // e.g. "/mihailo.jpg"

export function About() {
  const a = useT().about;
  return (
    <section id="about" className="section section--rule" aria-labelledby="about-title">
      <div className="container about">
        <Reveal className="about__photo">
          {PHOTO ? (
            <img src={PHOTO} alt={a.photoAlt} width={480} height={600} loading="lazy" />
          ) : (
            <div className="shot-placeholder">{a.photoPlaceholder}</div>
          )}
        </Reveal>
        <Reveal delay={80} className="about__copy">
          <p className="eyebrow">{a.eyebrow}</p>
          <h2 id="about-title" className="section__title">
            {a.title}
          </h2>
          {a.paras.map((x) => (
            <p key={x} className="about__para">
              {x}
            </p>
          ))}
          <div className="qa-card">
            <h3 className="qa-card__title">{a.qaTitle}</h3>
            <p className="qa-card__text">{a.qaText}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
