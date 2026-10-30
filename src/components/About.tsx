import { Reveal } from "./Reveal";
import { useT } from "../i18n";

/* The studio and what it stands for. No portrait: Northlane is a studio,
   not a person. The QA card is highlighted. */
export function About() {
  const a = useT().about;
  return (
    <section id="about" className="section section--rule" aria-labelledby="about-title">
      <div className="container about">
        <Reveal className="about__copy">
          <p className="eyebrow">{a.eyebrow}</p>
          <h2 id="about-title" className="section__title">
            {a.title}
          </h2>
          {a.paras.map((x) => (
            <p key={x} className="about__para">
              {x}
            </p>
          ))}
        </Reveal>
        <Reveal as="ul" delay={80} className="about__values">
          {a.values.map((v) => (
            <li key={v.title} className={"value-card" + (v.qa ? " value-card--qa" : "")}>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__text">{v.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
