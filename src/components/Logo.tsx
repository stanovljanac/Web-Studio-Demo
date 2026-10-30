/* Northlane mark: a compass needle pointing north on a round disc.
   Pure shapes (no font), coloured by the CSS variables; public/favicon.svg
   is the same drawing with fixed colours. */
const NORTH = "M20 6l5 14H15z";
const SOUTH = "M15 20h10l-5 14z";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle className="logo-mark__disc" cx="20" cy="20" r="20" />
      <path className="logo-mark__north" d={NORTH} />
      <path className="logo-mark__south" d={SOUTH} />
    </svg>
  );
}

/* Mark + wordmark. The wordmark is real text in the site font. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo__word">
        Northlane <span className="logo__word-light">Studio</span>
      </span>
    </span>
  );
}
