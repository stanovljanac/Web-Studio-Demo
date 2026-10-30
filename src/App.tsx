import { Analytics } from "@vercel/analytics/react";
import { DICTS, LocaleContext, type Locale, type Page } from "./i18n";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Audience } from "./components/Audience";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { About } from "./components/About";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { Privacy } from "./components/Privacy";
import { Footer } from "./components/Footer";
import { OFFER } from "./data/pricing";

export default function App({ locale, page }: { locale: Locale; page: Page }) {
  const t = DICTS[locale];
  return (
    <LocaleContext.Provider value={{ locale, page, t }}>
      <div className={"page" + (OFFER.open ? " has-offer" : "")}>
        <a className="skip-link" href="#main">
          {t.skip}
        </a>
        <Nav />
        <main id="main">
          {page === "home" ? (
            <>
              <Hero />
              <Audience />
              <Projects />
              <Services />
              <Process />
              <About />
              <Faq />
              <Contact />
            </>
          ) : (
            <Privacy />
          )}
        </main>
        <Footer />
        <Analytics />
      </div>
    </LocaleContext.Provider>
  );
}
