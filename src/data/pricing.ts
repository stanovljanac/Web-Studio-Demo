/* Every price and number on this demo is a placeholder (X, Y, Z, A, B, N).
   A value is written as {{X}}: <DemoText> shows it as a "demo value" chip,
   and `npm run qa:numbers` fails on any digit left in the visible text. */
export const demo = (name: string) => `{{${name}}}`;

/* Starting prices (EUR). Maintenance has no fixed price: it is agreed with
   each client, and work that takes longer is billed by the hour. */
export const PRICING = {
  website: demo("X"),
  landing: demo("Y"),
  hourly: demo("Z"),
};

/* Special offer for the next client projects. Set `open` to false and the
   bar above the nav, the offer block and the footer reminder disappear. */
export const OFFER = {
  open: true,
  website: demo("A"),
  landing: demo("B"),
  projects: demo("N"),
};

/* Terms used in the services, process, FAQ, contact and privacy copy. */
export const TERMS = {
  warrantyDays: demo("N"),
  revisionRounds: demo("N"),
  landingWeeks: `${demo("X")}–${demo("Y")}`,
  websiteWeeks: `${demo("Y")}–${demo("Z")}`,
  replyDays: demo("N"),
  keepMonths: demo("N"),
  year: demo("YYYY"),
  updated: demo("DD Month YYYY"),
};
