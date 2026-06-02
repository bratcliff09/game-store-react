export const PLATFORM = {
  NONE: { id: 0, value: "none", name: "NONE" },
  PS: { id: 1, value: "ps5", name: "Playstation 5" },
  NS: { id: 2, value: "ns", name: "Nintendo Switch 2" },
  PC: { id: 3, value: "pc", name: "PC" },
  XBOX: { id: 4, value: "xbox", name: "XBOX Series X" },
  PS4: { id: 5, value: "ps4", name: "Playstation 4" },
};

export const ESRB = {
  NONE: { id: 0, value: "", name: "" },
  E: { id: 1, value: "E", name: "E", img: "ESRB_E.png" },
  E10: { id: 2, value: "E10", name: "E10+", img: "ESRB_E10.png" },
  T: { id: 3, value: "T", name: "T", img: "ESRB_T.png" },
  M: { id: 4, value: "M", name: "M", img: "ESRB_M.png" },
};

export const productList = [
  {
    id: 0,
    title: "NieR:Automata",
    developer: "PlatinumGames Inc.",
    publisher: "Square Enix",
    platform: [PLATFORM.PS4, PLATFORM.PC, PLATFORM.XBOX, PLATFORM.NS],
    price: 39.99,
    sale: 0.25,
    releaseDate: "03/17/2017",
    esrb: {
      rating: ESRB.M,
      content: ["Blood", "Partial Nudity", "Violence", "Strong Language"],
    },
    description:
      "NieR: Automata tells the story of androids 2B, 9S and A2 and their battle to reclaim the machine-driven dystopia overrun by powerful machines.",
    images: {
      path: "nier_automata",
      main: "1.webp",
      carousel: ["2.webp", "3.webp"],
    },
  },
  {
    id: 1,
    title: "NieR Replicant",
    developer: "Toylogic Inc.",
    publisher: "Square Enix",
    platform: [PLATFORM.PS, PLATFORM.PC, PLATFORM.XBOX],
    price: 59.99,
    sale: 0,
    releaseDate: "04/23/2021",
    esrb: {
      rating: ESRB.M,
      content: ["Blood", "Suggestive Themes", "Violence", "Strong Language"],
    },
    description:
      "The upgraded prequel of NieR:Automata. A kind young man sets out with Grimoire Weiss, a strange talking book, to search for the 'Sealed verses' in order to save his sister Yonah, who fell terminally ill to the Black Scrawl.",
    images: {
      path: "nier_replicant",
      main: "1.webp",
      carousel: ["2.webp"],
    },
  },
  {
    id: 2,
    title: "A Hat in Time",
    developer: "Gears for Breakfast",
    publisher: "Gears for Breakfast",
    platform: [PLATFORM.PS4, PLATFORM.NS, PLATFORM.PC, PLATFORM.XBOX],
    price: 29.99,
    sale: 0.3,
    releaseDate: "10/05/2017",
    esrb: {
      rating: ESRB.T,
      content: ["Fantasy Violence", "Alcohol and Tobacco Reference"],
    },
    description:
      "A Hat in Time is a cute-as-heck 3D platformer featuring a little girl who stitches hats for wicked powers! Freely explore giant worlds and recover Time Pieces to travel to new heights!",
    images: {
      path: "hat_in_time",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 3,
    title: "Yakuza: Like a Dragon",
    developer: "Ryu Ga Gotoku Studio",
    publisher: "SEGA",
    platform: [PLATFORM.PS, PLATFORM.PC, PLATFORM.XBOX],
    price: 19.99,
    sale: 0.6,
    releaseDate: "11/10/2020",
    esrb: {
      rating: ESRB.M,
      content: [
        "Blood",
        "Intense Violence",
        "Sexual Themes",
        "Strong Language",
        "Use of Alcohol",
      ],
    },
    description:
      "Become Ichiban Kasuga, a low-ranking yakuza grunt left on the brink of death by the man he trusted most. Take up your legendary bat and get ready to crack some underworld skulls in dynamic RPG combat set against the backdrop of modern-day Japan.",
    images: {
      path: "yakuza_7",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 4,
    title: "Like a Dragon: Infinite Wealth",
    developer: "Ryu Ga Gotoku Studio",
    publisher: "SEGA",
    platform: [PLATFORM.PS, PLATFORM.PC, PLATFORM.XBOX],
    price: 69.99,
    sale: 0.7,
    releaseDate: "01/25/2024",
    esrb: {
      rating: ESRB.M,
      content: [
        "Intense Violence",
        "Blood",
        "Sexual Themes",
        "Partial Nudity",
        "Strong Language",
      ],
    },
    description:
      "Two larger-than-life heroes, Ichiban Kasuga and Kazuma Kiryu are brought together by the hand of fate, or perhaps something more sinister… Live it up in Japan and explore all that Hawaii has to offer in an RPG adventure so big it spans the Pacific.",
    images: {
      path: "yakuza_8",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 5,
    title: "STEINS;GATE",
    developer: "MAGES. Inc.",
    publisher: "Spike Chunsoft Co., Ltd.",
    platform: [PLATFORM.PS4, PLATFORM.PC],
    price: 29.99,
    sale: 0,
    releaseDate: "09/09/2016",
    esrb: {
      rating: ESRB.M,
      content: [
        "Violence",
        "Blood",
        "Sexual Themes",
        "Partial Nudity",
        "Strong Language",
      ],
    },
    description:
      "Developed by 5pb. and Nitroplus, STEINS;GATE was awarded Famitsu magazine's coveted annual Game of Excellence award and was voted one of the most emotionally charged “tear-inducing games” ever made, in a Famitsu poll.　It is a gripping and moving Visual Novel, which has already spawned manga and anime adaptations.",
    images: {
      path: "steins_gate",
      main: "3.webp",
      carousel: ["2.webp", "1.webp"],
    },
  },
  {
    id: 6,
    title: "Fate/Samurai Remnant",
    developer: "KOEI TECMO GAMES CO., LTD.",
    publisher: "KOEI TECMO GAMES CO., LTD.",
    platform: [PLATFORM.PS, PLATFORM.PC],
    price: 29.99,
    sale: 0,
    releaseDate: "09/28/2023",
    esrb: {
      rating: ESRB.T,
      content: [
        "Violence",
        "Blood and Gore",
        "Suggestive Themes",
        "Language",
        "Alcohol and Tobacco Reference",
      ],
    },
    description:
      "“Your wish shall perish...” A Holy Grail War begins in Edo Japan. A brand new Fate action RPG presented by TYPE-MOON and KOEI TECMO GAMES.",
    images: {
      path: "fate",
      main: "3.webp",
      carousel: ["2.webp", "1.webp"],
    },
  },
  {
    id: 7,
    title: "FINAL FANTASY VII",
    developer: "Square Enix",
    publisher: "Square Enix",
    platform: [PLATFORM.PS4, PLATFORM.PC, PLATFORM.NS],
    price: 11.99,
    sale: 0,
    releaseDate: "07/04/2013",
    esrb: {
      rating: ESRB.T,
      content: [
        "Blood",
        "Fantasy Violence",
        "Language",
        "Mild Suggestive Themes",
      ],
    },
    description:
      "The RPG classic FINAL FANTASY VII returns to PC, now with brand new online features!",
    images: {
      path: "ff7",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 8,
    title: "FINAL FANTASY IX",
    developer: "Square Enix",
    publisher: "Square Enix",
    platform: [PLATFORM.PC, PLATFORM.NS, PLATFORM.PS4],
    price: 20.99,
    sale: 0,
    releaseDate: "04/14/2016",
    esrb: {
      rating: ESRB.T,
      content: ["Violence", "Mild Language"],
    },
    description:
      "Selling over five million copies since its release in 2000, FINAL FANTASY IX proudly returns to PC and more! Experience the adventure once again with characters and pre-rendered movies featured in high definition, as well as a new booster system with a selection of various modes such as 'high speed' or 'no encounters'!",
    images: {
      path: "ff9",
      main: "1.webp",
      carousel: ["2.webp", "3.webp"],
    },
  },
  {
    id: 9,
    title: "Cyberpunk 2077",
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    platform: [PLATFORM.PS, PLATFORM.PC, PLATFORM.XBOX],
    price: 59.99,
    sale: 0.55,
    releaseDate: "12/09/2020",
    esrb: {
      rating: ESRB.M,
      content: [
        "Blood and Gore",
        "Intense Violence",
        "Nudity",
        "Strong Language",
        "Strong Sexual Content",
        "Use of Drugs",
        "Use of Alcohol",
      ],
    },
    description:
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification.",
    images: {
      path: "cyberpunk",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 10,
    title: "Marvel's Spider-Man 2",
    developer: "Insomniac Games",
    publisher: "PlayStation Publishing LLC",
    platform: [PLATFORM.PS, PLATFORM.PC],
    price: 59.99,
    sale: 0.55,
    releaseDate: "01/30/2025",
    esrb: {
      rating: ESRB.T,
      content: ["Blood", "Violence", "Drug Reference", "Mild Language"],
    },
    description:
      "Be Greater. Together. The incredible power of the symbiote forces Peter Parker and Miles Morales into a desperate fight as they balance their lives, friendships, and their duty to protect in an exciting chapter of the critically acclaimed Spider-Man franchise.",
    images: {
      path: "spider_man",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 11,
    title: "Ultimate Marvel Vs Capcom 3",
    developer: "Capcom",
    publisher: "Capcom",
    platform: [PLATFORM.PS4, PLATFORM.PC],
    price: 24.99,
    sale: 0.55,
    releaseDate: "03/06/2017",
    esrb: {
      rating: ESRB.T,
      content: [
        "Mild Blood",
        "Mild Language",
        "Partial Nudity",
        "Use of Alcohol",
        "Violence",
        "Suggestive Themes",
        "Online Interactions",
      ],
    },
    description:
      "Marvel and Capcom join forces to deliver the most frenetic 3 vs 3 tag battles ever with Ultimate Marvel VS Capcom 3. This release comes fully loaded, including all previous DLC, Marvel VS. Capcom : Official Complete Works.",
    images: {
      path: "umvc3",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 12,
    title: "HI-FI Rush",
    developer: "Tango Gameworks",
    publisher: "KRAFTON, Inc.",
    platform: [PLATFORM.XBOX, PLATFORM.PC],
    price: 29.99,
    sale: 0,
    releaseDate: "01/25/2023",
    esrb: {
      rating: ESRB.T,
      content: ["Fantasy Violence", "Language"],
    },
    description:
      " Test your abilities in two new game modes, uncover new rewards and even a few secrets in the Arcade Challenge! Update! Feel the beat as wannabe rockstar Chai and his ragtag team fight against an evil megacorp in a world that syncs to the music.",
    images: {
      path: "hifi_rush",
      main: "2.webp",
      carousel: ["1.webp"],
    },
  },
  {
    id: 13,
    title: "Kingdom Hearts 4",
    developer: "Capcom",
    publisher: "Capcom",
    platform: [PLATFORM.XBOX, PLATFORM.PC, PLATFORM.PS],
    price: 69.99,
    sale: 0,
    releaseDate: "02/26/2029",
    esrb: {
      rating: ESRB.E10,
      content: ["Fantasy Violence"],
    },
    description:
      "The fiftheenth installmment in the hit Kingdom Hearts series is on its way!!",
    images: {
      path: "kh4",
      main: "kh4.webp",
      carousel: [],
    },
  },
  {
    id: 14,
    title: "Resident Evil Requiem",
    developer: "Capcom",
    publisher: "Capcom",
    platform: [PLATFORM.XBOX, PLATFORM.PC, PLATFORM.PS, PLATFORM.NS],
    price: 69.99,
    sale: 0,
    releaseDate: "02/27/2026",
    esrb: {
      rating: ESRB.M,
      content: ["Intense Violence", "Blood and Gore", "Strong Language"],
    },
    description:
      "Requiem for the dead. Nightmare for the living. Prepare to escape death in a heart-stopping experience that will chill you to your core.",
    images: {
      path: "re9",
      main: "1.webp",
      carousel: ["2.webp", "3.webp"],
    },
  },
];
