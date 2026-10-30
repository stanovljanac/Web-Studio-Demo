import { useId } from "react";
import { LANG_NAMES, PATHS, useLocale, type Locale } from "../i18n";

const ORDER: Locale[] = ["en", "sr"];

/* Flags are inline SVG: emoji flags don't render on Windows. */
function Flag({ locale }: { locale: Locale }) {
  const id = useId().replace(/:/g, "");
  if (locale === "sr") {
    return (
      <svg className="flag" viewBox="0 0 3 2" aria-hidden="true">
        <rect width="3" height="2" fill="#fff" />
        <rect width="3" height="1.333" fill="#0C4076" />
        <rect width="3" height="0.667" fill="#C6363C" />
      </svg>
    );
  }
  return (
    <svg className="flag" viewBox="0 0 60 40" aria-hidden="true">
      <clipPath id={`${id}a`}>
        <rect width="60" height="40" />
      </clipPath>
      <clipPath id={`${id}b`}>
        <path d="M30 20h30v20zv20H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath={`url(#${id}a)`}>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0l60 40M60 0L0 40" clipPath={`url(#${id}b)`} stroke="#C8102E" strokeWidth="5" />
        <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
        <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

/* Two real links (EN | SR); the current language is highlighted. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { locale, page, t } = useLocale();
  return (
    <div className={"lang-switch " + className} role="group" aria-label={t.nav.langLabel}>
      {ORDER.map((l) => (
        <a
          key={l}
          href={PATHS[l][page]}
          hrefLang={l}
          lang={l}
          className={"lang-switch__opt" + (l === locale ? " is-active" : "")}
          aria-current={l === locale ? "true" : undefined}
          aria-label={LANG_NAMES[l]}
        >
          <Flag locale={l} />
          <span className="lang-switch__code" aria-hidden="true">
            {l.toUpperCase()}
          </span>
        </a>
      ))}
    </div>
  );
}
