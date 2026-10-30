import type { SVGProps } from "react";

/* Single line-icon system: 1.8px stroke (2px for arrows/checks),
   24px grid, round caps & joins. Sizing is controlled by the surrounding
   context, so icons carry no width/height of their own. */

type P = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowIcon = (p: P) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const MailIcon = (p: P) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ExternalIcon = (p: P) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const MessageIcon = (p: P) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <path d="M4 5h16v11H9l-5 4z" />
  </svg>
);
