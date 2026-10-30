import { Button } from "../ds";
import { ArrowIcon } from "./icons";
import { ContactLink } from "./Email";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { OFFER } from "../data/pricing";
import { PATHS, sectionHref, useLocale } from "../i18n";

export function Footer() {
  const { locale, page, t } = useLocale();
  const href = (id: string) => sectionHref(locale, page, id);
  return (
    <footer className="footer">
      <div className="container footer__cta">
        <div>
          <p className="footer__cta-title">{t.footer.ctaTitle}</p>
          {OFFER.open ? (
            <p className="footer__offer">
              <b>{t.services.offer.eyebrow}:</b> {t.footer.offer}{" "}
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
            <ContactLink kind="email">{t.contact.email}</ContactLink>
            <ContactLink kind="viber">{t.contact.viber}</ContactLink>
            <ContactLink kind="whatsapp">{t.contact.whatsapp}</ContactLink>
          </div>
          <div className="footer__group">
            <p className="footer__heading">{t.nav.langLabel}</p>
            <LangSwitch />
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>{t.footer.copy}</span>
        <a href={PATHS[locale].privacy}>{t.footer.privacy}</a>
      </div>
    </footer>
  );
}
