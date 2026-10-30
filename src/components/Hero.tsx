import { Button } from "../ds";
import { ArrowIcon } from "./icons";
import { useT } from "../i18n";
import { SHOTS, type Shot } from "../data/shots";

/* The salon's mobile screenshot (390×844 @3x, top of the page) shown in the
   phone frame; from scripts/capture-projects.mjs. */
const SALON_MOBILE_SHOT: Shot = SHOTS["mb-hair-salon-mobile"];
/* The phone screen is 270px wide, at most 220px on tablets and phones (.phone in site.css). */
const SALON_MOBILE_SIZES = "(max-width: 900px) 220px, 270px";

/* The hero deliberately does not use <Reveal>: it must be visible in the
   prerendered HTML immediately, before any JavaScript runs. */
export function Hero() {
  const t = useT();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            {t.hero.titleLead} <span className="accent">{t.hero.titleAccent}</span>
          </h1>
          <p className="hero__lede">{t.hero.lede}</p>
          <div className="hero__cta">
            <Button as="a" href="#work" variant="primary" size="lg" trailingIcon={<ArrowIcon />}>
              {t.hero.ctaWork}
            </Button>
            <Button as="a" href="#contact" variant="secondary" size="lg">
              {t.hero.ctaStart}
            </Button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="phone">
            <div className="phone__screen">
              <img
                src={SALON_MOBILE_SHOT.src}
                srcSet={SALON_MOBILE_SHOT.srcSet}
                sizes={SALON_MOBILE_SIZES}
                alt={t.hero.shotAlt}
                width={SALON_MOBILE_SHOT.width}
                height={SALON_MOBILE_SHOT.height}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
