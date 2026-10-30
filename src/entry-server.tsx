import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { OFFER } from "./data/pricing";
import type { Locale, Page } from "./i18n";

/* Used only at build time by scripts/prerender.mjs. */

/* <meta name="theme-color">: the colour at the top of the page, so the
   browser bar continues it: the offer bar (--accent) while the offer is
   open, otherwise the page background. */
export const themeColor = OFFER.open ? "#2F5BFF" : "#FFFFFF";

export function render(locale: Locale, page: Page): string {
  return renderToString(
    <StrictMode>
      <App locale={locale} page={page} />
    </StrictMode>,
  );
}
