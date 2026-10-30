import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Button } from "../ds";
import { ArrowIcon } from "./icons";
import { useT } from "../i18n";

/* The "this is a demo" notice: a modal <dialog> that opens on every page
   load, after hydration. showModal() makes the rest of the page inert and
   Esc closes it. The "Web Studio Demo" pill and every contact link
   (useDemoNotice) open it again. Without JavaScript a <noscript> bar in
   the HTML says the same. */
export const CREDIT_URL = "https://mihailobuilds.com/";

const DemoNoticeContext = createContext<() => void>(() => {});
export const useDemoNotice = () => useContext(DemoNoticeContext);

/* The pill that reopens the notice, in the nav next to the logo, so it is
   at the top of every screen: the full label, or "Demo" where the nav is
   narrow (site.css shows one or the other). */
export function DemoPill() {
  const t = useT().demo;
  const open = useDemoNotice();
  return (
    <button type="button" className="demo-pill" onClick={open} aria-haspopup="dialog" aria-label={t.pill}>
      <span className="demo-pill__long">{t.pill}</span>
      <span className="demo-pill__short">{t.pillShort}</span>
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

  /* On every load, not only the first visit: nothing is remembered. */
  useEffect(() => {
    open();
  }, [open]);

  /* A click on the backdrop lands on the <dialog> itself, but so does one on
     the card's own padding: only a click outside its box closes it. */
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    const d = e.currentTarget;
    const r = d.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (e.target === d && outside) d.close();
  };

  return (
    <DemoNoticeContext.Provider value={open}>
      {children}
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
