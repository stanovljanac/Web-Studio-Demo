import { PageContext, type Page } from "./i18n";
import { en } from "./i18n/en";
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

export default function App({ page }: { page: Page }) {
  const t = en;
  return (
    <PageContext.Provider value={{ page, t }}>
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
      </div>
    </PageContext.Provider>
  );
}
