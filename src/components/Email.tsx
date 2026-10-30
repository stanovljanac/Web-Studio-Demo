import { Fragment } from "react";
import type { ReactNode } from "react";
import { useT } from "../i18n";
import { DemoText } from "./DemoValue";
import { useDemoNotice } from "./DemoNotice";

/* A contact link (email / Viber / WhatsApp) of the fictional studio. There
   is no real address behind it: it is a button that opens the demo notice. */
export function ContactLink({ className = "", children }: { className?: string; children: ReactNode }) {
  const openNotice = useDemoNotice();
  return (
    <button type="button" className={"contact-link " + className} onClick={openNotice} aria-haspopup="dialog">
      {children}
    </button>
  );
}

/* Renders a dictionary string, replacing every "{email}" with an email link
   (and every {{X}} with a demo value). */
export function WithEmail({ text }: { text: string }) {
  const t = useT();
  const parts = text.split("{email}");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          <DemoText text={part} />
          {i < parts.length - 1 ? <ContactLink className="contact-link--inline">{t.contact.emailLink}</ContactLink> : null}
        </Fragment>
      ))}
    </>
  );
}
