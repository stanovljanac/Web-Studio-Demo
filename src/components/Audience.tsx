import { Reveal } from "./Reveal";
import { useT } from "../i18n";

export function Audience() {
  const t = useT();
  return (
    <section id="audience" className="section section--rule" aria-labelledby="audience-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">{t.audience.eyebrow}</p>
          <h2 id="audience-title" className="section__title">
            {t.audience.title}
          </h2>
          <p className="section__lede">{t.audience.lede}</p>
        </Reveal>
        <ol className="audience">
          {t.audience.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 60} className="audience__item">
              <span className="audience__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="audience__title">{item.title}</h3>
              <p className="audience__text">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
