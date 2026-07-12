import type { PortfolioConfig } from "@/data/types/portfolio";

export const atmosphere = {
  ariaLabel: "Portfolio descent telemetry",
  description:
    "Live visual telemetry follows the portfolio journey from the sea surface to the trench floor. It is decorative and does not affect navigation.",
  model: {
    maxDepth: 10911,
    probeViewportRatio: 0.55,
    metersPerAtmosphere: 10.06,
    numberLocale: "en-US",
    zones: [
      { id: "surface", startsAt: 0, label: "SURFACE" },
      { id: "epipelagic", startsAt: 2, label: "EPIPELAGIC" },
      {
        id: "mesopelagic",
        startsAt: 200,
        label: "MESOPELAGIC",
        pingLabel: "SONAR — ZONE BOUNDARY · MESOPELAGIC",
        tapeMark: true,
      },
      {
        id: "bathypelagic",
        startsAt: 1000,
        label: "BATHYPELAGIC",
        pingLabel: "SONAR — ZONE BOUNDARY · BATHYPELAGIC",
        tapeMark: true,
      },
      {
        id: "abyssopelagic",
        startsAt: 4000,
        label: "ABYSSOPELAGIC",
        pingLabel: "SONAR — ZONE BOUNDARY · ABYSSOPELAGIC",
        tapeMark: true,
      },
      {
        id: "hadal",
        startsAt: 6000,
        label: "HADAL",
        pingLabel: "SONAR — ZONE BOUNDARY · HADAL",
        tapeMark: true,
      },
      {
        id: "trench-floor",
        startsAt: 10880,
        label: "HADAL · ON BOTTOM",
        pingLabel: "BOTTOM CONTACT · DESCENT COMPLETE",
      },
    ],
    temperatureProfile: [
      [0, 21.4],
      [80, 19.6],
      [150, 13.8],
      [200, 11.9],
      [340, 9.4],
      [612, 6.3],
      [800, 5.2],
      [1000, 4.4],
      [1200, 3.9],
      [1900, 3.0],
      [2507, 2.4],
      [3300, 2.0],
      [4000, 1.8],
      [5200, 1.6],
      [6000, 1.6],
      [7400, 1.8],
      [9100, 2.0],
      [10300, 2.2],
      [10911, 2.3],
    ],
  },
  scene: {
    surface: {
      sheetUntilDepth: 42,
      sunUntilDepth: 95,
      raysUntilDepth: 300,
    },
    trench: {
      wallsStartDepth: 8400,
      wallsFullDepth: 10500,
    },
    floor: {
      visibleWithinMeters: 460,
      lightsWithinMeters: 340,
    },
    creatures: [
      { id: "siphonophore", depth: 612, span: 300, tapeMark: true },
      { id: "scattering-layer", depth: 800, span: 330 },
      { id: "lanternfish", depth: 1210, span: 260, tapeMark: true },
      { id: "anglerfish", depth: 2507, span: 240, tapeMark: true },
      { id: "dumbo-octopus", depth: 4050, span: 260, tapeMark: true },
    ],
  },
  bootSequence: ["––––", "····", "––––"],
  readouts: [
    {
      id: "depth",
      label: "DEPTH",
      initialValue: "····",
      unit: "M",
      primary: true,
    },
    {
      id: "pressure",
      label: "PRESS",
      initialValue: "····",
      unit: "ATM",
    },
    {
      id: "temperature",
      label: "TEMP",
      initialValue: "····",
      unit: "°C",
    },
    { id: "elapsed", label: "M.E.T.", initialValue: "····" },
  ],
  elapsedPrefix: "T+",
  bottomReadouts: {
    zone: {
      label: "ZONE",
      initialValue: "SURFACE",
    },
    rate: {
      label: "RATE",
      initialValue: "0",
      unit: "M/MIN",
    },
  },
  temperatureSigns: {
    positive: "+",
    negative: "−",
  },
  rateSigns: {
    positive: "",
    negative: "−",
  },
} as const satisfies PortfolioConfig["atmosphere"];
