import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import type { Locale, Page } from "./i18n";

/* Each HTML entry declares its language (<html lang>) and page
   (<div id="root" data-page>). Production HTML is prerendered, so we
   hydrate it; in dev the root is empty and we render from scratch. */
const root = document.getElementById("root")!;
const locale: Locale = document.documentElement.lang === "sr" ? "sr" : "en";
const page: Page = root.dataset.page === "privacy" ? "privacy" : "home";

const app = (
  <StrictMode>
    <App locale={locale} page={page} />
  </StrictMode>
);

if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
