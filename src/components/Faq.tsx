import { PlusIcon } from "./icons";
import { Reveal } from "./Reveal";
import { useT } from "../i18n";

export function Faq() {
  const f = useT().faq;
  return (
    <section id="faq" className="section section--rule" aria-labelledby="faq-title">
      <div className="container faq">
        <Reveal className="faq__head">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 id="faq-title" className="section__title">
            {f.title}
          </h2>
        </Reveal>
        <Reveal className="faq__list">
          {f.items.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>
                <span>{item.q}</span>
                <PlusIcon aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
