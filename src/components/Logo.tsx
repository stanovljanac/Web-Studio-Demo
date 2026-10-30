/* MB monogram: hand-drawn geometric letters on a square tile with an
   accent bar. Pure shapes (no font), coloured by the CSS variables. */
const M = "M7 27V11h3.9l2.35 7.6L15.6 11h3.9v16h-3.1v-9.4l-1.9 5.8H12l-1.9-5.8V27z";
const B_TOP = "M21 11h7a3.5 3.5 0 0 1 3.5 3.5v1A3.5 3.5 0 0 1 28 19h-7z";
const B_BOTTOM = "M21 18.5h7.5a4 4 0 0 1 4 4v.5a4 4 0 0 1-4 4H21z";
const B_HOLES =
  "M24.3 14.1h3.05a1.25 1.25 0 0 1 0 2.5H24.3zM24.3 20.6h3.5a1.7 1.7 0 0 1 0 3.4h-3.5z";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect className="logo-mark__tile" width="40" height="40" />
      <rect className="logo-mark__bar" y="35" width="40" height="5" />
      <path className="logo-mark__letters" d={`${M}${B_TOP}${B_BOTTOM}`} />
      <path className="logo-mark__tile" d={B_HOLES} />
    </svg>
  );
}

/* Mark + wordmark. The wordmark is real text in the site font. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo__word">Mihailo Builds</span>
    </span>
  );
}
