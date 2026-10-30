import { Button } from "../ds";
import { ArrowIcon } from "./icons";
import { ContactLink } from "./Email";
import { Logo, MbMark } from "./Logo";
import { CREDIT_URL } from "./DemoNotice";
import { DemoText } from "./DemoValue";
import { OFFER } from "../data/pricing";
import { PATHS, sectionHref, usePage } from "../i18n";

export function Footer() {
  const { page, t } = usePage();
  const href = (id: string) => sectionHref(page, id);
  return (
    <footer className="footer">
      <div className="container footer__cta">
        <div>
          <p className="footer__cta-title">{t.footer.ctaTitle}</p>
          {OFFER.open ? (
            <p className="footer__offer">
              <b>{t.services.offer.eyebrow}:</b> <DemoText text={t.footer.offer} />{" "}
              <a href={href("offer")}>
                {t.offerCta.see} <ArrowIcon aria-hidden="true" />
              </a>
            </p>
          ) : null}
        </div>
        <Button as="a" href={href("contact")} variant="primary" size="lg" trailingIcon={<ArrowIcon />}>
          {t.nav.cta}
        </Button>
      </div>
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo size={36} />
          <p>{t.footer.tagline}</p>
        </div>
        <nav className="footer__links" aria-label={t.footer.navLabel}>
          <p className="footer__heading">{t.footer.navTitle}</p>
          <a href={href("work")}>{t.nav.work}</a>
          <a href={href("services")}>{t.nav.services}</a>
          <a href={href("process")}>{t.nav.process}</a>
          <a href={href("faq")}>{t.nav.faq}</a>
          <a href={href("contact")}>{t.contact.eyebrow}</a>
        </nav>
        <div className="footer__meta">
          <div className="footer__group">
            <p className="footer__heading">{t.contact.eyebrow}</p>
            <ContactLink>{t.contact.email}</ContactLink>
            <ContactLink>{t.contact.viber}</ContactLink>
            <ContactLink>{t.contact.whatsapp}</ContactLink>
          </div>
        </div>
      </div>
      {/* The studio's line on the left, who made the demo on the right. */}
      <div className="container footer__bottom">
        <div className="footer__legal">
          <span>
            <DemoText text={t.footer.copy} />
          </span>
          <a href={PATHS.privacy}>{t.footer.privacy}</a>
        </div>
        <a className="footer__credit" href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
          {t.footer.credit}
          <MbMark size={22} />
          <b>{t.footer.creditName}</b>
          <span className="sr-only"> {t.demo.newTab}</span>
        </a>
      </div>
    </footer>
  );
}
