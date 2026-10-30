import { WithEmail } from "./Email";
import { PATHS, useT } from "../i18n";

export function Privacy() {
  const t = useT();
  const p = t.privacy;
  return (
    <article className="container legal" aria-labelledby="privacy-title">
      <a className="legal__back" href={PATHS.home}>
        ← {p.back}
      </a>
      <h1 id="privacy-title" className="legal__title">
        {p.title}
      </h1>
      <p className="legal__updated">{p.updated}</p>
      {p.sections.map((s) => (
        <section key={s.h} className="legal__section">
          <h2>{s.h}</h2>
          {s.p.map((x) => (
            <p key={x}>
              <WithEmail text={x} />
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
