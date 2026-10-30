import { CheckIcon, PlusIcon } from "./icons";
import { Reveal } from "./Reveal";
import { OFFER } from "../data/pricing";
import { useT } from "../i18n";

export function Services() {
  const t = useT();
  const s = t.services;
  return (
    <section id="services" className="section section--rule" aria-labelledby="services-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 id="services-title" className="section__title">
            {s.title}
          </h2>
          <p className="section__lede">{s.lede}</p>
        </Reveal>

        <div className="svc-grid">
          {s.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 70} className="svc-card">
              <h3 className="svc-card__name">{item.name}</h3>
              <p className="svc-card__price">{item.price}</p>
              <p className="svc-card__desc">{item.desc}</p>
            </Reveal>
          ))}
        </div>
        <p className="svc-note">{s.note}</p>

        <div className="svc-details">
          <Reveal className="svc-box">
            <h3 className="svc-box__title">{s.includesTitle}</h3>
            <ul className="checklist">
              {s.includes.map((x) => (
                <li key={x}>
                  <CheckIcon aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="svc-box">
            <h3 className="svc-box__title">{s.extrasTitle}</h3>
            <p className="svc-box__note">{s.extrasNote}</p>
            {s.extras.map((g) => (
              <div key={g.title} className="svc-group">
                <h4 className="svc-group__title">{g.title}</h4>
                <ul className="plainlist">
                  {g.items.map((x) => (
                    <li key={x}>
                      <PlusIcon aria-hidden="true" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="svc-more">
          <div>
            <h3 className="svc-more__title">{s.moreTitle}</h3>
            <p className="svc-more__text">{s.moreText}</p>
          </div>
          <ul className="chips">
            {s.more.map((x) => (
              <li key={x} className="chip">
                {x}
              </li>
            ))}
          </ul>
        </Reveal>

        {OFFER.open ? (
          /* The anchor wraps the Reveal: its fade-up offset would otherwise
             leave the block under the fixed nav after a jump to #offer. */
          <div id="offer">
            <Reveal className="offer">
              <p className="eyebrow">{s.offer.eyebrow}</p>
              <h3 className="offer__title">{s.offer.title}</h3>
              <p className="offer__text">{s.offer.text}</p>
              <p className="offer__prices">{s.offer.prices}</p>
              <p className="offer__note">{s.offer.note}</p>
            </Reveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
