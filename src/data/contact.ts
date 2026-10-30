/* Contact details are stored as character codes, so they never appear as
   readable text in the HTML or JS files, and they are never shown on the
   page: a link only gets its real mailto: / viber: / wa.me address at the
   moment a visitor clicks it (see <ContactLink>). This deters scrapers
   that harvest addresses from page source — it is not a security measure. */
const EMAIL_CODES = [104, 101, 108, 108, 111, 64, 110, 111, 114, 116, 104, 108, 97, 110, 101, 46, 101, 120, 97, 109, 112, 108, 101];
/** International format, digits only. */
const PHONE_CODES = [48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48];

const decode = (codes: number[]) => String.fromCharCode(...codes);

export type ContactKind = "email" | "viber" | "whatsapp";

/** Built only when a contact link is clicked. */
export function contactHref(kind: ContactKind): string {
  if (kind === "email") return `mailto:${decode(EMAIL_CODES)}`;
  const phone = decode(PHONE_CODES);
  return kind === "viber" ? `viber://chat?number=%2B${phone}` : `https://wa.me/${phone}`;
}
