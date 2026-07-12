import type { PortfolioLink } from "@/data/types/portfolio";

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
  identity: "identity",
  craft: "craft",
  curiosity: "curiosity",
  journey: "journey",
  connect: "connect",
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
      { id: "identity", label: "Identity", targetId: sectionIds.identity },
      { id: "craft", label: "Craft", targetId: sectionIds.craft, hideOnMobile: true },
      { id: "curiosity", label: "Curiosity", targetId: sectionIds.curiosity, hideOnMobile: true },
      { id: "journey", label: "Journey", targetId: sectionIds.journey },
      { id: "contact", label: "Connect", targetId: sectionIds.connect },
    ],
  },
  status: { label: "Link", value: profile.location },
} as const;
export const hero = {
  eyebrow: "YOLO · Sophisticated Dreamer · Frontend engineer",
  title: profile.shortName,
  note: "Design direction inspired by Susan Casey & Vescovo deep sea adventure",
  // a random generator for the introduction text will be placed,
  // ultimately each session will only show one introduction
  introduction: [
    "Say I was part of Naruto Great Ninja War, I would be a random ninja killed by Madara. Stupid enough to charge in front face to face againts him.",
    "If I were born inside One Piece universe, I would be a nameless marine officer living paycheck to paycheck. Being hopeful the world will get better each day.",
    "Have you ever wondered why humanity exist, why you exist? Yes I have and there are no concrete answers. We need to find it within ourself.",
    "Most first impression toward me will say im rigid, awkward, or someone who is assertive. Partly because of my strong square jawline.",
    "My favorite song is Alexandra by Reality Club, while my favorite melody is Gymnopedie No.1 by Erik Satie. Learnt piano for the sake to play it.",
  ],
  refers: profile.refer,
  callToAction: {
    id: "begin-trace",
    label: "Begin trace",
    targetId: sectionIds.identity,
    symbol: symbols.down,
  },
} as const;
export const contact = {
  id: sectionIds.contact,
  journey: { depth: 10911, elapsedMinutes: 258, dropVh: 115 },
  kicker: "Contact · End of trace",
  title: "Build something clear.",
  paragraphs: [
    {
      id: "invitation",
      text: "If the problem is complex, the constraints are real, and the interface needs to hold together, I would like to hear about it.",
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
