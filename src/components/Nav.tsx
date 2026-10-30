import { Button } from "../ds";
import { ArrowIcon } from "./icons";
import { useScrolled } from "../hooks/useScrolled";
import { Logo } from "./Logo";
import { DemoText } from "./DemoValue";
import { OFFER } from "../data/pricing";
import { PATHS, sectionHref, usePage } from "../i18n";

export function Nav() {
  const { page, t } = usePage();
  const scrolled = useScrolled();
  const href = (id: string) => sectionHref(page, id);

  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")}>
      {OFFER.open ? (
        <a className="offer-bar" href={href("offer")}>
          <span className="offer-bar__text">
            <b>{t.services.offer.eyebrow}</b>
            <span className="offer-bar__long">
              : <DemoText text={t.offerCta.bar} />
            </span>
            <span className="offer-bar__short">
              {" "}
              <DemoText text={t.offerCta.barShort} />
            </span>
          </span>
          <span className="offer-bar__cta">
            <span className="offer-bar__see">{t.offerCta.see}</span>
            <ArrowIcon aria-hidden="true" />
          </span>
        </a>
      ) : null}
      <div className="nav__inner">
        <a className="nav__logo" href={PATHS.home} aria-label={t.nav.home}>
          <Logo />
        </a>
        <nav className="nav__links" aria-label={t.nav.label}>
          <a className="nav__link" href={href("work")}>
            {t.nav.work}
          </a>
          <a className="nav__link" href={href("services")}>
            {t.nav.services}
          </a>
          <a className="nav__link" href={href("process")}>
            {t.nav.process}
          </a>
          <a className="nav__link" href={href("faq")}>
            {t.nav.faq}
          </a>
        </nav>
        <div className="nav__actions">
          <Button as="a" href={href("contact")} variant="primary" size="sm" trailingIcon={<ArrowIcon />}>
            {t.nav.cta}
          </Button>
        </div>
      </div>
    </header>
  );
}
