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

/* The MihailoBuilds monogram (the same drawing as on mihailobuilds.com),
   only for the maker's credit in the footer, never as the studio's logo.
   Light tile, dark letters, accent bar, coloured in site.css. */
const MB_LETTERS =
  "M7 27V11h3.9l2.35 7.6L15.6 11h3.9v16h-3.1v-9.4l-1.9 5.8H12l-1.9-5.8V27zM21 11h7a3.5 3.5 0 0 1 3.5 3.5v1A3.5 3.5 0 0 1 28 19h-7zM21 18.5h7.5a4 4 0 0 1 4 4v.5a4 4 0 0 1-4 4H21z";
const MB_HOLES = "M24.3 14.1h3.05a1.25 1.25 0 0 1 0 2.5H24.3zM24.3 20.6h3.5a1.7 1.7 0 0 1 0 3.4h-3.5z";

export function MbMark({ size = 24 }: { size?: number }) {
  return (
    <svg className="mb-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect className="mb-mark__tile" width="40" height="40" />
      <rect className="mb-mark__bar" y="35" width="40" height="5" />
      <path className="mb-mark__letters" d={MB_LETTERS} />
      <path className="mb-mark__tile" d={MB_HOLES} />
    </svg>
  );
}
