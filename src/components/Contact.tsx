import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Textarea } from "../ds";
import { ArrowIcon, CheckIcon, MailIcon, MessageIcon } from "./icons";
import { Reveal } from "./Reveal";
import { ContactLink } from "./Email";
import { DemoText } from "./DemoValue";
import { PATHS, useT } from "../i18n";

/* Demo form: it validates like a real one, shows "Sending…" for a moment
   and then says that nothing was sent. No request leaves the page and
   nothing is stored. */
const FAKE_SEND_MS = 800;

type Errors = { name?: string; email?: string; message?: string };
type Status = "idle" | "submitting" | "success";

export function Contact() {
  const t = useT();
  const c = t.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  // Guards against double submits before the "submitting" state re-renders.
  const busy = useRef(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = c.errName;
    if (!email) next.email = c.errEmail;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = c.errEmailInvalid;
    if (!message) next.message = c.errMessage;
    setErrors(next);
    if (Object.keys(next).length) return;

    busy.current = true;
    setStatus("submitting");
    timer.current = window.setTimeout(() => {
      busy.current = false;
      setStatus("success");
    }, FAKE_SEND_MS);
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
                <p className="contact__demo-note">{c.formNote}</p>
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
                <ContactLink>
                  <MailIcon aria-hidden="true" />
                  <span>
                    <b>{c.email}</b>
                    <small>{c.emailValue}</small>
                  </span>
                </ContactLink>
              </li>
              <li>
                <ContactLink>
                  <MessageIcon aria-hidden="true" />
                  <span>
                    <b>{c.viber}</b>
                    <small>
                      <DemoText text={c.phoneValue} />
                    </small>
                  </span>
                </ContactLink>
              </li>
              <li>
                <ContactLink>
                  <MessageIcon aria-hidden="true" />
                  <span>
                    <b>{c.whatsapp}</b>
                    <small>
                      <DemoText text={c.phoneValue} />
                    </small>
                  </span>
                </ContactLink>
              </li>
            </ul>
            <p className="contact__reply">
              <DemoText text={c.reply} />
            </p>
            <p className="contact__privacy">
              {c.privacyLead} <a href={PATHS.privacy}>{c.privacyLink}</a>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
