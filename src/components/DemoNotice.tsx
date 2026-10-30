import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Button } from "../ds";
import { ArrowIcon } from "./icons";
import { useT } from "../i18n";

/* The "this is a demo" notice: a modal <dialog> that opens once, on a
   first visit, after hydration. showModal() makes the rest of the page
   inert and Esc closes it. The "Web Studio Demo" pill and every contact
   link (useDemoNotice) open it again. Without JavaScript a
   <noscript> bar in the HTML says the same. */
const SEEN_KEY = "demo-notice-v1";
const CREDIT_URL = "https://mihailobuilds.com/";

const DemoNoticeContext = createContext<() => void>(() => {});
export const useDemoNotice = () => useContext(DemoNoticeContext);

/* The pill that reopens the notice: in the bottom-left corner, or in the
   nav next to the logo on phones, where a corner pill would cover content
   (site.css shows one or the other). */
export function DemoPill({ inNav = false }: { inNav?: boolean }) {
  const t = useT().demo;
  const open = useDemoNotice();
  return (
    <button
      type="button"
      className={"demo-pill " + (inNav ? "demo-pill--nav" : "demo-pill--corner")}
      onClick={open}
      aria-haspopup="dialog"
      aria-label={inNav ? t.pill : undefined}
    >
      {inNav ? t.pillShort : t.pill}
    </button>
  );
}

export function DemoNoticeProvider({ children }: { children: ReactNode }) {
  const t = useT().demo;
  const dialog = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    const d = dialog.current;
    if (!d || d.open) return;
    d.showModal();
    d.querySelector<HTMLElement>(".demo-notice__close")?.focus();
  }, []);

  /* Remembered as soon as it is shown, not on "close": that event comes a
     task after Esc, so a quick reload would miss it and show it again. */
  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY) === "1") return;
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    open();
  }, [open]);

  // A click on the backdrop lands on the <dialog> itself, not on its content.
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  };

  return (
    <DemoNoticeContext.Provider value={open}>
      {children}
      <DemoPill />
      <dialog ref={dialog} className="demo-notice" aria-labelledby="demo-notice-title" onClick={onDialogClick}>
        <p className="eyebrow">{t.pill}</p>
        <h2 id="demo-notice-title" className="demo-notice__title">
          {t.title}
        </h2>
        {t.paras.map((x) => (
          <p key={x} className="demo-notice__text">
            {x}
          </p>
        ))}
        <p className="demo-notice__credit">
          {t.credit} ·{" "}
          <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
            {t.creditLink} <ArrowIcon aria-hidden="true" />
            <span className="sr-only"> {t.newTab}</span>
          </a>
        </p>
        <div className="demo-notice__actions">
          <Button className="demo-notice__close" variant="primary" onClick={() => dialog.current?.close()}>
            {t.close}
          </Button>
        </div>
      </dialog>
    </DemoNoticeContext.Provider>
  );
}
