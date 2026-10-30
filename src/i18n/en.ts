import { OFFER, PRICING, TERMS, demo } from "../data/pricing";

/* All copy on the site. The shape of this object is the Dict type.
   Northlane Studio is fictional; {{X}} marks a placeholder value. */
export const en = {
  skip: "Skip to content",

  nav: {
    label: "Main navigation",
    home: "Northlane Studio — home",
    work: "Work",
    services: "Services",
    process: "Process",
    faq: "FAQ",
    cta: "Start a project",
  },

  /* Links to the special offer (#offer): the bar above the nav and the footer reminder. */
  offerCta: {
    bar: `the next ${OFFER.projects} client projects at a lower price.`,
    barShort: `for the next ${OFFER.projects} projects`,
    see: "See the offer",
  },

  hero: {
    eyebrow: "Websites and landing pages for small businesses",
    titleLead: "Your business needs more than",
    titleAccent: "an Instagram profile.",
    lede: "We build modern websites and landing pages that present your services, build trust and make it easy for customers to contact you or book an appointment.",
    ctaWork: "View our work",
    ctaStart: "Start a project",
    shotAlt: "The MB Hair Salon website on a phone",
  },

  audience: {
    eyebrow: "Who it's for",
    title: "Is this for you?",
    lede: "You probably need a website if one of these sounds familiar.",
    items: [
      {
        title: "You're starting a new business and need your first website.",
        text: "We'll build it from scratch — from structure to launch.",
      },
      {
        title: "Your current website looks outdated.",
        text: "We'll redesign it into a fresh, modern site built for phones.",
      },
      {
        title: "You only have Instagram and want a professional online presence.",
        text: "A website with your services, prices and contact details in one place.",
      },
      {
        title: "You're launching a new service or offer.",
        text: "A landing page that presents it clearly and leads visitors to call or get in touch.",
      },
    ],
  },

  work: {
    eyebrow: "Work",
    title: "A few things we've built.",
    lede: "Demo projects, designed, built and launched end to end — from a salon website to an invoicing tool. Each one is live, so you can try it.",
    visit: "Visit site",
    newTab: "(opens in a new tab)",
  },

  services: {
    eyebrow: "Services & starting prices",
    title: "What we can build for you.",
    lede: "Starting prices for the most common projects. You get the exact price in a written proposal.",
    items: [
      {
        name: "Business website",
        price: `from €${PRICING.website}`,
        desc: "A complete online presence: services and prices, about you, gallery and contact — everything a customer needs to know before they call.",
      },
      {
        name: "Landing page",
        price: `from €${PRICING.landing}`,
        desc: "One page with one goal: getting visitors to call, send an enquiry or book. For a new service, offer or campaign.",
      },
      {
        name: "Maintenance",
        price: "By agreement",
        desc: `Agreed with each client, based on what the website needs: changes, additions, technical checks and updates. Anything that takes longer is billed at €${PRICING.hourly} per hour.`,
      },
    ],
    note: "The final price depends on scope, number of pages and functionality.",
    includesTitle: "Every project includes",
    includes: [
      "Custom design for desktop and mobile",
      "Development to the agreed structure and functionality",
      "One clearly visible contact method of your choice: call, email, message or a simple contact form",
      "A basic technical SEO setup",
      "Testing of navigation, links and agreed functionality",
      "Setup and launch on the agreed hosting",
      `A ${TERMS.warrantyDays}-day warranty`,
    ],
    extrasTitle: "Additional functionality",
    extrasNote: "Based on the agreed project scope.",
    extras: [
      {
        title: "Content & presentation",
        items: ["Gallery", "Price list or menu", "Additional sections", "A second language"],
      },
      {
        title: "Integrations & functionality",
        items: [
          "Appointment request form (arrives in your email)",
          "Online booking through a service (e.g. Cal.com)",
          "Reservation systems",
          "External platforms",
          "More complex forms (multi-step, file uploads)",
        ],
      },
    ],
    moreTitle: "Need more than a website?",
    moreText: "We can also help with what comes with a website — as an add-on or separately.",
    more: ["Domain & hosting", "Google Business Profile setup", "Basic SEO setup"],
    offer: {
      eyebrow: "Special offer",
      title: `The next ${OFFER.projects} client projects`,
      text: `For the next ${OFFER.projects} client projects we're offering a special, lower price while we build our portfolio of client work. In return, we agree that we can show the finished project as an example of our work. If you're happy with how we worked together, we'd also appreciate you sharing your honest experience.`,
      prices: `Business website from €${OFFER.website} · Landing page from €${OFFER.landing}`,
      note: "Applies to the core build, not to additional functionality.",
    },
  },

  process: {
    eyebrow: "Process",
    title: "A clear process, no surprises.",
    steps: [
      { title: "Conversation", text: "We talk about your business, your goals and what the website needs to achieve." },
      { title: "Proposal & deposit", text: "You get a written proposal with scope, price and timeline; work starts after the deposit." },
      { title: "Design", text: "We design the home page, which you approve before the build continues." },
      { title: "Build & revisions", text: `We build the website, with ${TERMS.revisionRounds} rounds of revisions within the agreed scope.` },
      { title: "Launch", text: `The website goes live, covered by a ${TERMS.warrantyDays}-day warranty.` },
    ],
    scopeNote:
      "A new design after approval, new sections, new functionality or replacing all of the content are agreed as new work.",
    youTitle: "You provide",
    you: ["Logo", "Copy", "Services and prices", "Photos", "Contact details"],
    youNote: "Help with copy can be arranged.",
    meTitle: "We handle",
    me: ["Structure", "Design", "Development", "Launch", "Technical SEO basics", "Testing"],
    ownTitle: "We build it. You own it.",
    ownText: "The domain and accounts are registered in your name — the website is fully yours.",
  },

  about: {
    eyebrow: "About",
    title: "A small studio. You talk to the people who build your site.",
    paras: [
      "Northlane Studio builds websites and landing pages for small businesses — salons, cafés, trades, studios and practices. The people you meet in the first conversation are the ones who design, build and launch your site.",
      "We work online, with clients anywhere.",
    ],
    values: [
      {
        title: "Clear before we start",
        text: "Starting prices are on this page, and you get the scope, price and timeline in writing before any work begins.",
      },
      {
        title: "Phones first",
        text: "Most of your visitors arrive on a phone, so every layout is designed and checked on small screens first.",
      },
      {
        title: "Built with a QA mindset",
        text: "Before launch we check every website across devices and browsers, and test forms, links, navigation and the agreed functionality — all the small things that are easy to miss.",
        qa: true,
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "How much does a website cost?",
        a: `Landing pages start from €${PRICING.landing} and business websites from €${PRICING.website}. You get the exact price in a written proposal once we know the scope, number of pages and functionality.`,
      },
      {
        q: "How long does it take?",
        a: `Usually ${TERMS.landingWeeks} weeks for a landing page and ${TERMS.websiteWeeks} weeks for a business website. It depends mostly on when the copy and photos are ready. The exact timeline is in the proposal.`,
      },
      {
        q: "What do you need from me?",
        a: "Your logo, copy, services and prices, photos and contact details. If some of it isn't ready, help with copy can be arranged.",
      },
      {
        q: "Who owns the domain and the website?",
        a: "You do. The domain and accounts are registered in your name, and you get all access when the project is done.",
      },
      {
        q: "Can I change content or add features later?",
        a: "Yes. Small changes can go through monthly maintenance, and new sections or features are agreed as separate work.",
      },
      {
        q: "Can the website have online booking?",
        a: "Yes. The simplest options are connecting a booking service you already use or a ready-made one (e.g. Cal.com), or adding an appointment request form that arrives in your email. If you need something more tailored, it's done as additional functionality: before we start, we'll tell you how much time and money it takes and whether it makes sense for your budget.",
      },
      {
        q: "What if something doesn't work after launch?",
        a: `The ${TERMS.warrantyDays}-day warranty covers bugs in the build and in agreed functionality. New requests, content changes and new features are billed separately. Outages of external services and hosting are handled by their providers.`,
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your website.",
    lede: "Not sure what kind of website you need? Tell us about your business and we'll find the right solution together.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    messageLabel: "Message",
    messagePlaceholder: "What does your business do and what do you need?",
    submit: "Send message",
    sending: "Sending…",
    errName: "Please enter your name.",
    errEmail: "Please enter your email address.",
    errEmailInvalid: "Please enter a valid email address.",
    errMessage: "Tell us a little about your project.",
    formNote: "Demo form — messages are not sent.",
    successTitle: "Demo: no message was sent.",
    successText: "On a live site, your message would reach the studio's inbox and this is where you'd see the confirmation.",
    sendAnother: "Try the form again",
    directTitle: "Or contact us directly",
    email: "Email",
    viber: "Viber",
    whatsapp: "WhatsApp",
    emailValue: "hello@northlane.example",
    phoneValue: demo("+000 00 000 000"),
    emailLink: "by email",
    reply: `We reply within ${TERMS.replyDays} business days.`,
    privacyLead: "In this demo, nothing you type is sent or stored.",
    privacyLink: "Privacy policy",
  },

  footer: {
    tagline: "Websites and landing pages for small businesses.",
    privacy: "Privacy",
    navLabel: "Footer navigation",
    navTitle: "Navigation",
    copy: `© ${TERMS.year} Northlane Studio`,
    ctaTitle: "Have a project in mind?",
    offer: `a lower price for the next ${OFFER.projects} client projects.`,
  },

  demo: {
    valueTitle: "Placeholder value in this demo",
    pricesNote: "All prices and numbers on this site are placeholders — this is a demo.",
    pill: "Web Studio Demo",
    pillShort: "Demo",
    title: "This is a demo website.",
    paras: [
      "Northlane Studio is a fictional web studio. Its name, prices, contact details, form and privacy policy are made up, and nothing you type here is sent anywhere.",
      "The projects in the Work section are real: each one is live, so you can try it.",
    ],
    credit: "Designed & built by Mihailo Šebek",
    creditLink: "MihailoBuilds",
    newTab: "(opens in a new tab)",
    close: "Got it, show me the site",
  },

  privacy: {
    title: "Sample privacy policy",
    updated: `Last updated: ${TERMS.updated}`,
    back: "Back to home",
    note: "Northlane Studio is fictional, and this is a sample of the policy a small studio would publish. This demo itself collects no personal data: the contact form sends nothing, and there are no cookies or analytics. The site is hosted on Vercel, which processes standard request data, such as IP addresses, to deliver the pages.",
    sections: [
      {
        h: "Who processes your data",
        p: ["Northlane Studio is the data controller. For any data-related questions, contact us {email}."],
      },
      {
        h: "What data we collect",
        p: [
          "When you send a message through the contact form: your name, email address and the content of the message.",
          "When you contact us directly (email, Viber, WhatsApp): the information you choose to send.",
        ],
      },
      {
        h: "Purpose and legal basis",
        p: [
          "We use the details from your message only to reply and, if you ask, to prepare a proposal. This processing is necessary for steps taken at your request before any possible collaboration.",
          "We don't sell your data, use it for advertising or send newsletters.",
        ],
      },
      {
        h: "How long we keep data",
        p: [
          `We keep messages for as long as needed to respond to your enquiry and, if we work together, for the duration of the collaboration. If we don't end up working together, we delete them no later than ${TERMS.keepMonths} months after our last contact.`,
        ],
      },
      {
        h: "Who else has access",
        p: [
          "The services that deliver form messages, store email and host the website. A live policy names each provider, the data it processes and the country it processes it in.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You have the right to request access to your data, its correction or deletion, restriction of processing, data portability, and to object to processing.",
          "You can send a request {email} or through the contact form. You also have the right to lodge a complaint with your data protection authority.",
        ],
      },
    ],
  },
};

export type Dict = typeof en;
