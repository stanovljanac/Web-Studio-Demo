import { OFFER, PRICING } from "../data/pricing";

export const sr = {
  skip: "Preskoči na sadržaj",

  nav: {
    label: "Glavna navigacija",
    home: "MihailoBuilds — početna",
    work: "Radovi",
    services: "Usluge",
    process: "Kako radim",
    faq: "FAQ",
    cta: "Započni projekat",
    langLabel: "Jezik",
  },

  /* Links to the special offer (#offer): the bar above the nav and the footer reminder. */
  offerCta: {
    bar: "sledeća 3 klijentska projekta po nižoj ceni.",
    barShort: "za sledeća 3 projekta",
    see: "Pogledajte ponudu",
  },

  hero: {
    eyebrow: "Izrada sajtova i landing stranica za male biznise",
    titleLead: "Vašem biznisu treba više od",
    titleAccent: "Instagram profila.",
    lede: "Pravim moderne sajtove i landing stranice koji predstavljaju vaše usluge, grade poverenje i olakšavaju klijentima da vas kontaktiraju ili zakažu termin.",
    ctaWork: "Pogledaj radove",
    ctaStart: "Započni projekat",
    shotAlt: "Sajt MB Hair Salon na telefonu",
  },

  audience: {
    eyebrow: "Za koga",
    title: "Da li je ovo za vas?",
    lede: "Sajt vam verovatno treba ako se prepoznajete u nekoj od ovih situacija.",
    items: [
      {
        title: "Pokrećete novi biznis i treba vam prvi sajt.",
        text: "Napraviću vam sajt od nule — od strukture do objave.",
      },
      {
        title: "Vaš trenutni sajt izgleda zastarelo.",
        text: "Redizajniraću ga u svež, moderan sajt prilagođen telefonima.",
      },
      {
        title: "Imate samo Instagram, a želite profesionalnu online prezentaciju.",
        text: "Sajt na kome su vaše usluge, cene i kontakt na jednom mestu.",
      },
      {
        title: "Pokrećete novu uslugu ili ponudu.",
        text: "Landing stranica koja je jasno predstavlja i vodi posetioca do poziva ili upita.",
      },
    ],
  },

  work: {
    eyebrow: "Radovi",
    title: "Nekoliko stvari koje sam napravio.",
    lede: "Lični projekti koje sam sam osmislio, dizajnirao i objavio — od sajta za salon do alata za fakture.",
    visit: "Pogledaj sajt",
    newTab: "(otvara se u novom tabu)",
  },

  services: {
    eyebrow: "Usluge i početne cene",
    title: "Šta mogu da napravim za vas.",
    lede: "Početne cene za najčešće projekte. Tačnu cenu dobijate u pisanoj ponudi.",
    items: [
      {
        name: "Sajt za biznis",
        price: `od ${PRICING.website} €`,
        desc: "Kompletna online prezentacija: usluge i cene, o vama, galerija i kontakt — sve što klijent treba da zna pre nego što vas pozove.",
      },
      {
        name: "Landing stranica",
        price: `od ${PRICING.landing} €`,
        desc: "Jedna stranica sa jednim ciljem: da posetilac pozove, pošalje upit ili zakaže. Za novu uslugu, ponudu ili kampanju.",
      },
      {
        name: "Održavanje",
        price: "Po dogovoru",
        desc: `Dogovara se sa svakim klijentom, prema potrebama sajta: izmene, dopune, tehničke provere i ažuriranja. Ako nešto traži više vremena, naplaćuje se ${PRICING.hourly} € po satu.`,
      },
    ],
    note: "Konačna cena zavisi od obima, broja stranica i funkcija.",
    includesTitle: "Svaki projekat uključuje",
    includes: [
      "Prilagođen dizajn za desktop i telefone",
      "Izradu prema dogovorenoj strukturi i funkcijama",
      "Jedan jasno istaknut način kontakta po vašem izboru: poziv, email, poruka ili jednostavna kontakt forma",
      "Osnovnu tehničku SEO pripremu",
      "Testiranje navigacije, linkova i dogovorenih funkcija",
      "Pripremu i objavu na dogovorenom hostingu",
      "30 dana garancije",
    ],
    extrasTitle: "Dodatne funkcije",
    extrasNote: "Po dogovorenom obimu projekta.",
    extras: [
      {
        title: "Sadržaj i prezentacija",
        items: ["Galerija", "Cenovnik ili meni", "Dodatne sekcije", "Drugi jezik"],
      },
      {
        title: "Integracije i funkcionalnosti",
        items: [
          "Forma za zahtev termina (stiže na email)",
          "Online zakazivanje preko servisa (npr. Cal.com)",
          "Rezervacioni sistemi",
          "Spoljne platforme",
          "Složenije forme (više koraka, upload fajlova)",
        ],
      },
    ],
    moreTitle: "Treba vam više od sajta?",
    moreText: "Mogu da pomognem i oko onoga što ide uz sajt — kao dodatak ili posebno.",
    more: ["Domen i hosting", "Podešavanje Google Business Profile-a", "Osnovno SEO podešavanje"],
    offer: {
      eyebrow: "Posebna ponuda",
      title: "Sledeća tri klijentska projekta",
      text: "Za sledeća tri klijentska projekta nudim posebnu, nižu cenu dok gradim portfolio komercijalnih radova. Zauzvrat dogovaramo mogućnost da završeni projekat predstavim kao primer svog rada. Ako ste zadovoljni saradnjom, biće mi drago da podelite i svoje iskreno iskustvo.",
      prices: `Sajt za biznis od ${OFFER.website} € · Landing stranica od ${OFFER.landing} €`,
      note: "Važi za osnovnu izradu, ne za dodatne funkcije.",
    },
  },

  process: {
    eyebrow: "Kako radim",
    title: "Jasan proces, bez iznenađenja.",
    steps: [
      { title: "Razgovor", text: "Pričamo o vašem biznisu, ciljevima i tome šta sajt treba da postigne." },
      { title: "Ponuda i avans", text: "Dobijate pisanu ponudu sa obimom, cenom i rokom; rad počinje nakon avansa." },
      { title: "Dizajn", text: "Pravim dizajn početne stranice, koji vi odobravate pre nastavka izrade." },
      { title: "Izrada i izmene", text: "Izrađujem sajt, uz dva kruga izmena u okviru dogovorenog obima." },
      { title: "Objava", text: "Sajt ide uživo, a narednih 30 dana pokriva ga garancija." },
    ],
    scopeNote:
      "Novi dizajn posle odobrenja, nove sekcije, nove funkcije ili zamena celog sadržaja dogovaraju se kao novi posao.",
    youTitle: "Vi obezbeđujete",
    you: ["Logo", "Tekstove", "Usluge i cene", "Fotografije", "Kontakt podatke"],
    youNote: "Pomoć oko tekstova je po dogovoru.",
    meTitle: "Ja radim",
    me: ["Strukturu", "Dizajn", "Izradu", "Objavu", "Tehničku SEO osnovu", "Testiranje"],
    ownTitle: "Ja ga pravim. Vaš je.",
    ownText: "Domen i nalozi glase na vaše ime — sajt je u potpunosti vaš.",
  },

  about: {
    eyebrow: "O meni",
    title: "Radite direktno sa mnom.",
    paras: [
      "Ja sam Mihailo. Pravim sajtove i landing stranice za male biznise — od prvog razgovora do objave, bez posrednika.",
      "Radim online, sa klijentima bilo gde.",
    ],
    photoAlt: "Mihailo",
    photoPlaceholder: "[[fotografija]]",
    qaTitle: "Pravljeno sa QA pristupom",
    qaText:
      "Moje iskustvo je u testiranju softvera. Zato pre objave proveravam sajt na različitim uređajima i browserima, testiram forme, linkove, navigaciju i dogovorene funkcije — sve sitnice koje se lako propuste.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Česta pitanja",
    items: [
      {
        q: "Koliko košta sajt?",
        a: `Landing stranica počinje od ${PRICING.landing} €, a sajt za biznis od ${PRICING.website} €. Tačnu cenu dobijate u pisanoj ponudi, kada znamo obim, broj stranica i funkcije.`,
      },
      {
        q: "Koliko traje izrada?",
        a: "Obično 1–2 nedelje za landing stranicu i 2–4 nedelje za sajt za biznis. Najviše zavisi od toga kada su spremni tekstovi i fotografije. Tačan rok piše u ponudi.",
      },
      {
        q: "Šta je potrebno od mene?",
        a: "Logo, tekstovi, usluge i cene, fotografije i kontakt podaci. Ako nešto od toga nemate spremno, oko tekstova mogu da pomognem po dogovoru.",
      },
      {
        q: "Ko je vlasnik domena i sajta?",
        a: "Vi. Domen i nalozi registruju se na vaše ime, a po završetku dobijate sve pristupe.",
      },
      {
        q: "Mogu li kasnije da menjam sadržaj ili dodam funkcije?",
        a: "Da. Sitne izmene mogu da idu kroz mesečno održavanje, a nove sekcije ili funkcije dogovaramo kao poseban posao.",
      },
      {
        q: "Može li sajt da ima online zakazivanje?",
        a: "Da. Najjednostavnije je povezati servis koji već koristite ili gotov servis za zakazivanje (npr. Cal.com), ili dodati formu za zahtev termina koja stiže na vaš email. Ako vam treba nešto prilagođenije, to se radi kao dodatna funkcija: pre početka vam kažem koliko vremena i novca zahteva i da li ima smisla za vaš budžet.",
      },
      {
        q: "Šta ako nešto ne radi posle objave?",
        a: "Garancija od 30 dana pokriva greške u izradi i dogovorenim funkcijama. Novi zahtevi, izmene sadržaja i nove funkcije naplaćuju se posebno. Kvarove spoljnih servisa i hostinga rešava njihov pružalac.",
      },
    ],
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Hajde da pričamo o vašem sajtu.",
    lede: "Niste sigurni kakav vam sajt treba? Opišite svoj biznis i zajedno ćemo naći rešenje.",
    nameLabel: "Ime",
    namePlaceholder: "Vaše ime",
    emailLabel: "Email",
    emailPlaceholder: "ime@primer.com",
    messageLabel: "Poruka",
    messagePlaceholder: "Čime se bavite i šta vam treba?",
    submit: "Pošalji poruku",
    sending: "Šalje se…",
    errName: "Unesite ime.",
    errEmail: "Unesite email adresu.",
    errEmailInvalid: "Unesite ispravnu email adresu.",
    errMessage: "Napišite nekoliko reči o projektu.",
    errNotConnected: "Forma još nije povezana — pišite mi direktno {email}.",
    errNetwork: "Greška na mreži — pokušajte ponovo ili mi pišite direktno.",
    errGeneric: "Nešto nije u redu. Pokušajte ponovo.",
    successTitle: "Poruka je poslata.",
    successText: "Hvala — javiću vam se u roku od jednog radnog dana.",
    sendAnother: "Pošalji novu poruku",
    subject: "Nova poruka sa mihailobuilds.com",
    directTitle: "Ili mi pišite direktno",
    email: "Email",
    viber: "Viber",
    whatsapp: "WhatsApp",
    opensEmail: "Otvara email aplikaciju",
    opensViber: "Otvara Viber",
    opensWhatsapp: "Otvara WhatsApp",
    emailLink: "emailom",
    reply: "Odgovaram u roku od jednog radnog dana.",
    privacyLead: "Podatke iz forme koristim samo da vam odgovorim.",
    privacyLink: "Politika privatnosti",
  },

  footer: {
    tagline: "Sajtovi i landing stranice za male biznise.",
    privacy: "Privatnost",
    navLabel: "Navigacija u podnožju",
    navTitle: "Navigacija",
    copy: "© 2026 MihailoBuilds",
    ctaTitle: "Imate projekat?",
    offer: "niža cena za sledeća tri klijentska projekta.",
  },

  privacy: {
    title: "Politika privatnosti",
    updated: "Poslednja izmena: 5. oktobra 2026.",
    back: "Nazad na početnu",
    sections: [
      {
        h: "Ko obrađuje podatke",
        p: [
          "Rukovalac podacima je Mihailo Sebek, Srbija. Za sva pitanja o podacima pišite mi {email}.",
          "Na obradu se primenjuje Zakon o zaštiti podataka o ličnosti Republike Srbije.",
        ],
      },
      {
        h: "Koje podatke prikupljam",
        p: [
          "Kada pošaljete poruku preko kontakt forme: ime, email adresu i sadržaj poruke.",
          "Kada me kontaktirate direktno (email, Viber, WhatsApp): podatke koje sami pošaljete.",
          "Prilikom posete sajtu: tehničke podatke koje obrađuju hosting i analitika (opisano ispod).",
        ],
      },
      {
        h: "Svrha i pravni osnov",
        p: [
          "Podatke iz poruka koristim isključivo da vam odgovorim i, ako to zatražite, pripremim ponudu. Obrada je neophodna za radnje koje preduzimam na vaš zahtev pre eventualne saradnje.",
          "Podatke o posetama koristim da razumem posećenost sajta. Pravni osnov je moj legitimni interes da znam kako se sajt koristi; statistika je zbirna i ne pokazuje ko ste.",
          "Podatke ne prodajem, ne koristim za oglašavanje i ne šaljem newsletter.",
        ],
      },
      {
        h: "Koliko dugo čuvam podatke",
        p: [
          "Poruke čuvam onoliko koliko je potrebno da odgovorim na upit, a ako dođe do saradnje — tokom njenog trajanja. Ako do saradnje ne dođe, brišem ih najkasnije 12 meseci posle poslednjeg kontakta.",
          "Web3Forms čuva poruke iz forme najduže tri godine od slanja, ako se ranije ne obrišu. Vercel Web Analytics briše sesije poseta posle 24 sata. Ostale podatke Vercel i Google čuvaju prema svojim politikama privatnosti.",
        ],
      },
      {
        h: "Ko još ima pristup podacima",
        p: [
          "Web3Forms (Web3Creative, Indija) — servis koji poruke iz kontakt forme prosleđuje na moj email. Poruke prolaze kroz njegovu infrastrukturu kod Amazon Web Services-a, Cloudflare-a i Hetznera, a IP adresu i email adresu pošiljaoca mogu da provere filteri za spam CleanTalk i Akismet.",
          "Vercel Inc. (SAD) — hosting sajta i Vercel Web Analytics za merenje posećenosti. Pri svakoj poseti Vercel obrađuje vašu IP adresu, grad i državu određene na osnovu nje i tehničke podatke o browseru i uređaju. Analitika čuva samo anonimne podatke: stranicu, sajt sa kog ste došli, državu, region i grad, operativni sistem, browser i vrstu uređaja.",
          "Google (Gmail) — moj email servis, u kome se čuvaju primljene poruke.",
        ],
      },
      {
        h: "Prenos podataka van Srbije",
        p: [
          "Navedeni servisi obrađuju podatke van Srbije. Vercel podatke obrađuje uglavnom u SAD; za prenos iz EU koristi standardne ugovorne klauzule EU i EU-U.S. Data Privacy Framework. Web3Forms radi iz Indije, na infrastrukturi koja može obrađivati podatke u više regiona, a za prenos iz EU koristi standardne ugovorne klauzule EU. Google podatke čuva na serverima širom sveta.",
        ],
      },
      {
        h: "Kolačići i analitika",
        p: [
          "Sajt ne koristi kolačiće za oglašavanje ni praćenje sa drugih sajtova. Za osnovnu statistiku posećenosti koristi se Vercel Web Analytics, koji ne koristi kolačiće trećih strana: posetioca prepoznaje po hešu napravljenom iz zahteva i ne čuva sesije poseta trajno, već ih briše posle 24 sata.",
        ],
      },
      {
        h: "Vaša prava",
        p: [
          "Imate pravo da zatražite pristup svojim podacima, njihovu ispravku ili brisanje, ograničenje obrade, prenosivost podataka i da uložite prigovor na obradu.",
          `Zahtev možete poslati {email} ili preko kontakt forme. Takođe imate pravo da podnesete pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.`,
        ],
      },
    ],
  },
};

export type Dict = typeof sr;
