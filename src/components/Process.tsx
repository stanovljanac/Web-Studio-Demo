import { CheckIcon } from "./icons";
import { Reveal } from "./Reveal";
import { useT } from "../i18n";

export function Process() {
  const p = useT().process;
  return (
    <section id="process" className="section section--rule" aria-labelledby="process-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 id="process-title" className="section__title">
            {p.title}
          </h2>
        </Reveal>

        <ol className="steps">
          {p.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 60} className="step">
              <span className="step__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </Reveal>
          ))}
        </ol>
        <p className="steps__note">{p.scopeNote}</p>

        <div className="split">
          <Reveal className="split__col">
            <h3 className="split__title">{p.youTitle}</h3>
            <ul className="checklist">
              {p.you.map((x) => (
                <li key={x}>
                  <CheckIcon aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="split__note">{p.youNote}</p>
          </Reveal>
          <Reveal delay={80} className="split__col">
            <h3 className="split__title">{p.meTitle}</h3>
            <ul className="checklist">
              {p.me.map((x) => (
                <li key={x}>
                  <CheckIcon aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="own">
          <p className="own__title">{p.ownTitle}</p>
          <p className="own__text">{p.ownText}</p>
        </Reveal>
      </div>
    </section>
  );
}
