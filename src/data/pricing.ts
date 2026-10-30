/* Starting prices (EUR), shared by both language versions. Maintenance
   has no fixed price: it is agreed with each client, and work that takes
   longer is billed by the hour. */

export const PRICING = {
  website: "400",
  landing: "200",
  hourly: "15",
};

/* Special offer for the next three client projects. Set `open` to
   false once the three spots are taken — the block then disappears.
   The offer is not renewed. */
export const OFFER = {
  open: true,
  website: "250",
  landing: "120",
};
