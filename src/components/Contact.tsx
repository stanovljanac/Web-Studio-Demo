import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Textarea } from "../ds";
import { ArrowIcon, CheckIcon, MailIcon, MessageIcon } from "./icons";
import { Reveal } from "./Reveal";
import { ContactLink, WithEmail } from "./Email";
import { PATHS, useLocale } from "../i18n";

/* ------------------------------------------------------------------
   Web3Forms — free, no-backend email delivery for static sites.
   The access key lives in .env as VITE_WEB3FORMS_ACCESS_KEY. It is
   safe to expose in client-side code: it only ever delivers
   submissions to the inbox registered with Web3Forms, nothing else.
------------------------------------------------------------------ */
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "";

type Errors = { name?: string; email?: string; message?: string };
type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const { locale, t } = useLocale();
  const c = t.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  // Guards against double submits before the "submitting" state re-renders.
  const busy = useRef(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot: real visitors never see or tick this box.
    if (data.get("botcheck")) {
      setStatus("success");
      return;
    }
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = c.errName;
    if (!email) next.email = c.errEmail;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = c.errEmailInvalid;
    if (!message) next.message = c.errMessage;

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setFormError("");

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus("error");
      setFormError(c.errNotConnected);
      return;
    }

    busy.current = true;
    setStatus("submitting");
    try {
      data.append("access_key", WEB3FORMS_ACCESS_KEY);
      data.append("subject", c.subject);
      data.append("from_name", "MihailoBuilds website");

      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setFormError(c.errGeneric);
      }
    } catch {
      setStatus("error");
      setFormError(c.errNetwork);
    } finally {
      busy.current = false;
    }
  }

  return (
    <section id="contact" className="section section--rule" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="contact-title" className="section__title">
            {c.title}
          </h2>
          <p className="section__lede">{c.lede}</p>
        </Reveal>

        <div className="contact">
          <div className="contact__main" aria-live="polite">
            {status !== "success" ? (
              <form className="contact__form" onSubmit={onSubmit} noValidate>
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
                <div className="contact__row">
                  <Input
                    label={c.nameLabel}
                    name="name"
                    autoComplete="name"
                    placeholder={c.namePlaceholder}
                    error={errors.name}
                  />
                  <Input
                    label={c.emailLabel}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={c.emailPlaceholder}
                    error={errors.email}
                  />
                </div>
                <Textarea
                  label={c.messageLabel}
                  name="message"
                  placeholder={c.messagePlaceholder}
                  rows={5}
                  error={errors.message}
                />
                {status === "error" && formError ? (
                  <p className="contact__error" role="alert">
                    <WithEmail text={formError} />
                  </p>
                ) : null}
                <div>
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    trailingIcon={<ArrowIcon />}
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? c.sending : c.submit}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="contact__success">
                <div className="contact__success-icon">
                  <CheckIcon aria-hidden="true" />
                </div>
                <h3>{c.successTitle}</h3>
                <p>{c.successText}</p>
                <Button variant="secondary" onClick={() => setStatus("idle")}>
                  {c.sendAnother}
                </Button>
              </div>
            )}
          </div>

          <aside className="contact__aside">
            <h3 className="contact__aside-title">{c.directTitle}</h3>
            <ul className="contact__channels">
              <li>
                <ContactLink kind="email">
                  <MailIcon aria-hidden="true" />
                  <span>
                    <b>{c.email}</b>
                    <small>{c.opensEmail}</small>
                  </span>
                </ContactLink>
              </li>
              <li>
                <ContactLink kind="viber">
                  <MessageIcon aria-hidden="true" />
                  <span>
                    <b>{c.viber}</b>
                    <small>{c.opensViber}</small>
                  </span>
                </ContactLink>
              </li>
              <li>
                <ContactLink kind="whatsapp">
                  <MessageIcon aria-hidden="true" />
                  <span>
                    <b>{c.whatsapp}</b>
                    <small>{c.opensWhatsapp}</small>
                  </span>
                </ContactLink>
              </li>
            </ul>
            <p className="contact__reply">{c.reply}</p>
            <p className="contact__privacy">
              {c.privacyLead} <a href={PATHS[locale].privacy}>{c.privacyLink}</a>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
