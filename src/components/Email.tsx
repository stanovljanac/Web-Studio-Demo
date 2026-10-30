import { Fragment } from "react";
import type { MouseEvent, ReactNode } from "react";
import { contactHref, type ContactKind } from "../data/contact";
import { sectionHref, useLocale } from "../i18n";

/* A link to email / Viber / WhatsApp that shows no address or number.
   Its href points to the contact form; the real address is set only when
   the visitor clicks, and the browser then opens the matching app. */
export function ContactLink({
  kind,
  className,
  children,
}: {
  kind: ContactKind;
  className?: string;
  children: ReactNode;
}) {
  const { locale, page } = useLocale();
  const reveal = (e: MouseEvent<HTMLAnchorElement>) => {
    const a = e.currentTarget;
    a.href = contactHref(kind);
    if (kind === "whatsapp") {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  };
  return (
    <a href={sectionHref(locale, page, "contact")} className={className} onClick={reveal} onAuxClick={reveal}>
      {children}
    </a>
  );
}

/* Renders a dictionary string, replacing every "{email}" with an email link. */
export function WithEmail({ text }: { text: string }) {
  const { t } = useLocale();
  const parts = text.split("{email}");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 ? <ContactLink kind="email">{t.contact.emailLink}</ContactLink> : null}
        </Fragment>
      ))}
    </>
  );
}
