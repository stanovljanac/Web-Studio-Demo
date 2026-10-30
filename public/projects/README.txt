Project screenshots used on the site. Do not edit these files by hand:
they are made by scripts/capture-projects.mjs, which also writes
src/data/shots.ts (srcset, width, height for every image).

  mb-hair-salon-*.webp               featured work card, desktop: the booking
                                     section ("Reserve your chair."), not the
                                     hero, which the phone in our own hero shows
  mb-hair-salon-mobile-gallery-*.webp  phone over the corner of that card:
                                     the gallery section on mobile
  mb-hair-salon-mobile-*.webp        phone in the hero: top of the salon site
  keeper-*.webp                      Keeper card (top of the page)
  automation-desk-*.webp             The Automation Desk card (top of the page)
  invoice-*.webp                     Invoice Generator card: Mihailo's dashboard
                                     screenshot with the app's nav
                                     (scripts/sources/invoice-dashboard.webp,
                                     2000x1387, cut to 16:10); the live app needs
                                     a login, so it is never captured

Format
  desktop  1440x900 @2x, cut to 16:10, WebP at 640/960/1280/1600 px
  mobile   390x844 @3x, WebP at 300/450/600/810 px
  Viewport only (top of the page or one section, with the site's nav),
  no full-page strips.

Recapture (when a site changes)
  node scripts/capture-projects.mjs              all sites, then export
  node scripts/capture-projects.mjs sites=keeper only Keeper, then export
  node scripts/capture-projects.mjs export       export again from the last capture

  Every frame of every site is saved to .capture/projects/ (git-ignored),
  e.g. the salon's services, stylists, gallery, booking and visit sections.
  To use another frame, change USE in the script and run it with "export".

New invoice screenshot
  Chrome DevTools > Device toolbar > 1440x900, DPR 2 > "Capture screenshot",
  top of the dashboard with the navigation, no cursor or open menus. Save it
  in scripts/sources/, point the invoice entry of USE at it and run the
  script with "export".
