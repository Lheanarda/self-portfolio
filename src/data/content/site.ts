import type { PortfolioLink } from "@/data/types/portfolio";
import { echoMapRadar } from "./echo-map";

export const profile = {
  shortName: "Alexander",
  fullName: "Alexander Leonardo",
  role: "Frontend engineer",
  location: "Jakarta, Indonesia",
  email: "alexanderleo0499@gmail.com",
  expertise: ["React", "Next.js", "TypeScript", "Architecture", "Performance"],
  refer: [
    { id: "brought-to-life", label: "Brought to life", href: "#" },
    { id: "codex", label: "Codex", href: "https://openai.com/codex/" },
    {
      id: "guywithtwocats",
      label: "guywithtwocats",
      href: "https://github.com/GuyWithTwoCats?tab=repositories",
    },
  ],
} as const;
export const symbols = {
  inlineSeparator: " · ",
  statusSeparator: " — ",
  sectionDivider: " / ",
  down: "▾",
  outbound: "↗",
  up: "↑",
} as const;
export const anchors = { mainContent: "main-content", hero: "top" } as const;
export const sectionIds = {
  sunlight: "sunlight",
  twilight: "twilight",
  midnight: "midnight",
  abyss: "abyss",
  hadal: "hadal",
  contact: "contact",
} as const;
export const emailLink = {
  id: "email",
  label: "Email",
  displayLabel: profile.email,
  href: `mailto:${profile.email}`,
} as const satisfies PortfolioLink;
export const contactLinks = [
  emailLink,
  { id: "github", label: "GitHub", href: "https://github.com/lheanarda", openInNewTab: true },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alexanderleonardo-653b49198/",
    openInNewTab: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/alexander__leonardo/",
    openInNewTab: true,
  },
] as const satisfies readonly PortfolioLink[];
export const metadata = {
  title: `${profile.fullName} — ${profile.role}`,
  description:
    "Frontend engineer building reliable interfaces, durable systems, and thoughtful web experiences.",
  author: profile.fullName,
  creator: profile.fullName,
} as const;
export const accessibility = { skipToContent: "Skip to content" } as const;
export const sequence = { digits: 2, tracePrefix: "TRACE" } as const;
export const header = {
  home: {
    id: "home",
    label: profile.shortName,
    targetId: anchors.hero,
    ariaLabel: `${profile.fullName}, home`,
  },
  navigation: {
    ariaLabel: "Primary navigation",
    items: [
      { id: "epipelagic", label: "Sunlight", targetId: sectionIds.sunlight },
      { id: "mesopelagic", label: "Twilight", targetId: sectionIds.twilight, hideOnMobile: true },
      {
        id: "bathypelagic",
        label: "Midnight",
        targetId: sectionIds.midnight,
        hideOnMobile: true,
      },
      { id: "abyssopelagic", label: "Abyss", targetId: sectionIds.abyss },
      { id: "hadal", label: "Hadal", targetId: sectionIds.hadal },
    ],
  },
  status: { label: "Link", value: profile.location },
} as const;
export const hero = {
  eyebrow: "YOLO · Sophisticated Dreamer · Frontend engineer",
  title: profile.shortName,
  note: "Design direction inspired by Susan Casey and Vescovo deep sea adventure",
  introduction: [
    {
      id: "one-piece",
      text: "Imagine I was born inside One Piece universe, high probability I would be a nameless marine officer living paycheck to paycheck or being part of a revolution. Hoping one day, the world might be a little bit better.",
    },
    {
      id: "existence",
      text: "Have you ever wondered why humanity exist, why do you exist? There are no concrete answers for it and we need to find the answer by ourself. Look at your own self.",
    },
    {
      id: "music",
      text: 'One of my favorite song is Alexandra by Reality Club, an emotional rock that slowly bring you the letter of love, "The labyrinth i thought i knew rearranged to shape anew at amazement of the excitement that once rang true".',
    },
    {
      id: "music-piece",
      text: "I can listen to Gymnopedie No.1 by Erik Satie for hours. It is slow, and haunting yet calming. Melodies that uncover life memories, slowly, and there is nothing we can do than accept it. Learnt to play piano just for this piece.",
    },
  ],
  refers: profile.refer,
  callToAction: {
    id: "begin-trace",
    label: "Begin descent",
    targetId: sectionIds.sunlight,
    symbol: symbols.down,
  },
} as const;
export const experience = {
  limitingFactor: {
    ariaLabel:
      "Limiting Factor expedition vehicle. Drag to reposition, use arrow keys when focused, or activate to open Echo Map.",
    instruction:
      "Drag to reposition. Arrow keys move the vehicle; hold Shift for a larger step. Press Enter or activate to open Echo Map.",
  },
  echoMap: {
    id: "echo-map",
    eyebrow: "Limiting Factor / Navigation console",
    title: "Echo Map",
    description:
      "A live acoustic picture of the water nearby, with every expedition coordinate within reach.",
    openingLabel: "Synchronizing local depth field",
    closeLabel: "Dismiss map",
    navigationLabel: "Expedition coordinates",
    positionLabel: "of",
    surfaceLabel: "Surface signal",
    surfaceZoneLabel: "Surface",
    contactLabel: "Trench contact",
    contactZoneLabel: "Trench floor",
    currentLabel: "Current",
    passedLabel: "Passed",
    upcomingLabel: "Uncharted",
    depthUnit: "m",
    numberLocale: "en-US",
    radar: echoMapRadar,
  },
} as const;
export const contact = {
  id: sectionIds.contact,
  journey: { depth: 10911, elapsedMinutes: 258, dropVh: 115 },
  kicker: "Contact · 10,911 m · Trench floor",
  title: "A signal from the bottom.",
  paragraphs: [
    {
      id: "bottom",
      text: "The modeled descent ends near the deepest measured point of the Mariana Trench. The vehicle's lamps reveal only a small field of sediment while almost eleven kilometers of water press above it. There is no panoramic view—only a bright patch, a dark horizon, and instruments confirming that the bottom is real.",
    },
    {
      id: "connected-ocean",
      text: "The layers passed on the way down were never separate worlds. Surface light became living tissue, living tissue became falling particles, and trenches gathered part of what survived the journey. Even here, in permanent night, the surface remains present as food, chemistry, and history.",
    },
    {
      id: "invitation",
      text: "This is the end of the trace, not the end of the ocean. If the story left you with a question, an observation, or an idea worth bringing back to the surface, send a signal.",
    },
  ],
  primaryLink: emailLink,
  links: contactLinks,
  linkSymbol: symbols.outbound,
} as const;
export const footer = {
  lines: [
    { id: "identity", parts: [profile.fullName, profile.role, profile.location] },
    { id: "expertise", parts: profile.expertise, hideOnMobile: true },
  ],
  returnLink: {
    id: "return-to-surface",
    label: "Return to surface",
    targetId: anchors.hero,
    symbol: symbols.up,
  },
} as const;
