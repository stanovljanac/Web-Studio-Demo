import { SHOTS, type Shot } from "./shots";

export type Project = {
  slug: string;
  name: string;
  /** Small label above the name: always says it is a personal project. */
  label: string;
  desc: string;
  url: string;
  /** Desktop screenshot (16:10, from scripts/capture-projects.mjs). */
  shot: Shot;
  /** Featured project gets the large card, with this mobile screenshot on a phone over the corner. */
  featured?: boolean;
  mobileShot?: Shot;
};

/* Order matters: the salon website is the closest example of what
   is being sold, so it comes first. Every project links to its live site. */
export const PROJECTS: Project[] = [
  {
    slug: "mb-hair-salon",
    name: "MB Hair Salon",
    label: "Personal project · Hair salon website",
    desc: "Website for a hair salon: services and prices, gallery, location and an appointment booking flow (design concept; in production it connects to a booking service).",
    url: "https://demohairsalon.mihailobuilds.com/",
    shot: SHOTS["mb-hair-salon"],
    featured: true,
    mobileShot: SHOTS["mb-hair-salon-mobile-gallery"],
  },
  {
    slug: "keeper",
    name: "Keeper",
    label: "Personal project · Online course website",
    desc: "Landing page and website for an online photography course, with 23 modules organised by category.",
    url: "https://keeper.mihailobuilds.com/",
    shot: SHOTS.keeper,
  },
  {
    slug: "automation-desk",
    name: "The Automation Desk",
    label: "Personal project · Personal brand website",
    desc: "Website for a content creator's personal brand: YouTube and social channels, resources, methodology and an enquiry form.",
    url: "https://automationdesk.mihailobuilds.com/",
    shot: SHOTS["automation-desk"],
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    label: "Personal project · Interactive tool",
    desc: "In-browser invoice generator: data entry, tax calculation and PDF export.",
    url: "https://invoice.mihailobuilds.com/",
    shot: SHOTS.invoice,
  },
];
