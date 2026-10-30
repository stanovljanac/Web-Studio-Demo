import { ExternalIcon } from "./icons";
import { Reveal } from "./Reveal";
import { PROJECTS, type Project } from "../data/projects";
import { useLocale } from "../i18n";

/* `sizes` for the screenshots: the browser frame is the card's wider column
   (3/5) minus its padding, or the full card once it stacks (≤ 900px).
   Keep in step with .work-card / .mini-phone in site.css. */
const SHOT_SIZES = "(max-width: 640px) calc(100vw - 68px), (max-width: 900px) calc(100vw - 132px), (max-width: 1240px) calc(60vw - 120px), 624px";
const PHONE_SIZES = "(max-width: 640px) 84px, (max-width: 900px) 110px, 134px";

function ProjectCard({ p, flip }: { p: Project; flip: boolean }) {
  const { locale, t } = useLocale();
  const domain = new URL(p.url).host;
  return (
    <article className={"work-card" + (p.featured ? " work-card--featured" : "") + (flip ? " work-card--flip" : "")}>
      <div className="work-card__media">
        <div className="browser">
          <div className="browser__bar" aria-hidden="true">
            <span className="browser__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="browser__url">{domain}</span>
          </div>
          <div className="browser__view">
            <img
              src={p.shot.src}
              srcSet={p.shot.srcSet}
              sizes={SHOT_SIZES}
              alt=""
              loading="lazy"
              decoding="async"
              width={p.shot.width}
              height={p.shot.height}
            />
          </div>
        </div>
        {p.featured && p.mobileShot ? (
          <div className="mini-phone" aria-hidden="true">
            <div className="mini-phone__screen">
              <img src={p.mobileShot.src} srcSet={p.mobileShot.srcSet} sizes={PHONE_SIZES} alt="" loading="lazy" decoding="async" width={p.mobileShot.width} height={p.mobileShot.height} />
            </div>
          </div>
        ) : null}
      </div>
      <div className="work-card__body">
        <p className="work-card__label">{p.label[locale]}</p>
        <h3 className="work-card__name">{p.name}</h3>
        <p className="work-card__desc">{p.desc[locale]}</p>
        <a className="work-card__link" href={p.url} target="_blank" rel="noopener noreferrer">
          {t.work.visit}
          <span className="sr-only">
            {" "}
            — {p.name} {t.work.newTab}
          </span>
          <ExternalIcon aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function Projects() {
  const t = useLocale().t;
  return (
    <section id="work" className="section section--rule" aria-labelledby="work-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">{t.work.eyebrow}</p>
          <h2 id="work-title" className="section__title">
            {t.work.title}
          </h2>
          <p className="section__lede">{t.work.lede}</p>
        </Reveal>
        {/* One row per project; every other row has the screenshot on the right. */}
        <div className="work-list">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug}>
              <ProjectCard p={p} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
