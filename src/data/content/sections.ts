import type { PortfolioSection } from "@/data/types/portfolio";
import { sectionIds } from "./site";

export const sections = [
  {
    kind: "log",
    id: sectionIds.sunlight,
    journey: {
      stratum: { depth: 0, elapsedMinutes: 0 },
      entry: { depth: 40, elapsedMinutes: 2 },
      stratumDropVh: 90,
      entryDropVh: 26,
    },
    waypoints: [
      {
        id: "color-falls-away",
        journey: { depth: 100, elapsedMinutes: 6, dropVh: 115 },
        traceLabel: "LIGHT PROFILE",
        status: "Fading",
        title: "The ocean edits the spectrum as it descends.",
        paragraphs: [
          {
            id: "colors",
            text: "Near the surface, sunlight arrives with its colors intact. Water quickly absorbs the warmer reds and oranges, then yellows and greens, until blue becomes the last broad color carried into the distance. An animal that looks vivid in a diver’s lamp may become a dark silhouette when the lamp is gone.",
          },
          {
            id: "adaptation",
            text: "That changing light reshapes behavior. Silvery fish scatter the remaining brightness, transparent bodies avoid making a shadow, and countershading turns a pale belly toward the sun while a dark back faces the water below. Even here, in the bright ocean, visibility is already a negotiation.",
          },
        ],
      },
      {
        id: "edge-of-photosynthesis",
        journey: { depth: 190, elapsedMinutes: 11, dropVh: 115 },
        traceLabel: "PHOTIC LIMIT",
        status: "Threshold",
        title: "At the lower edge, sunlight stops being enough.",
        paragraphs: [
          {
            id: "last-light",
            text: "Approaching two hundred meters, daylight has thinned into a cold blue suggestion. Light may still be detected below this point under clear conditions, but it is usually too weak to power meaningful photosynthesis. The great surface engine reaches its practical lower boundary here.",
          },
          {
            id: "inheritance",
            text: "Nothing below becomes independent of what happened above. Dead plankton, shed cells, waste, dust, and fragments begin their slow fall as marine snow. The sunlight zone passes energy into darkness one particle at a time, starting a story that will continue all the way to the trench floor.",
          },
        ],
      },
    ],
    header: {
      kicker: "Epipelagic zone · 0–200 m",
      title: "Sunlight",
      subtitle: "Weather · Photosynthesis · The ocean’s living skin",
    },
    entry: {
      traceLabel: "SURFACE RECORD",
      status: { kind: "text", label: "Illuminated" },
      title: "Where the ocean begins by breathing.",
      paragraphs: [
        {
          id: "surface-interface",
          text: "The descent begins at an interface only a few molecules thick. Above it is moving air; below it is a water column nearly eleven kilometers deep. Wind folds oxygen into waves, heat crosses in both directions, storms rearrange the upper water, and currents carry the memory of distant climates across entire basins.",
        },
        {
          id: "primary-production",
          text: "Sunlight turns the upper two hundred meters into the ocean’s main workshop. Microscopic phytoplankton use light, carbon dioxide, water, and dissolved nutrients to build living matter. They form the base of most marine food webs and contribute roughly half of the oxygen produced on Earth, even though much of that oxygen is consumed again within the sea.",
        },
        {
          id: "visible-life",
          text: "This is the ocean people recognize: tuna crossing blue water, sharks following prey, dolphins breathing at the boundary, sea turtles navigating between feeding grounds, and plankton drifting wherever currents decide. Near coasts, the same light feeds seagrass meadows, kelp forests, and the algae living inside reef-building corals.",
        },
      ],
      tags: {
        ariaLabel: "Sunlight zone life",
        items: [
          { id: "phytoplankton", label: "Phytoplankton" },
          { id: "pelagic-fish", label: "Tuna & sharks" },
          { id: "air-sea-exchange", label: "Air–sea exchange" },
        ],
      },
      context: {
        label: "Field note",
        title: "The surface is not a ceiling. It is an engine.",
        paragraphs: [
          {
            id: "energy-source",
            text: "Nearly every scene deeper in this descent begins with energy captured here. Sunlight becomes plankton; plankton becomes prey; and what is not eaten begins to sink.",
          },
          {
            id: "moving-boundary",
            text: "The zone is never uniform. Latitude, season, cloud, nutrients, water clarity, and mixing decide how productive or transparent a particular patch of surface ocean can be.",
          },
        ],
      },
    },
  },
  {
    kind: "log",
    id: sectionIds.twilight,
    journey: {
      stratum: { depth: 200, elapsedMinutes: 12 },
      entry: { depth: 340, elapsedMinutes: 16 },
      stratumDropVh: 90,
      entryDropVh: 105,
    },
    waypoints: [
      {
        id: "living-light",
        journey: { depth: 612, elapsedMinutes: 24, dropVh: 125 },
        traceLabel: "BIOLUMINESCENCE",
        status: "Detected",
        title: "The darkness begins to answer with light.",
        paragraphs: [
          {
            id: "light-language",
            text: "Here, light is no longer weather; it is language. Photophores shine beneath a lanternfish to erase its silhouette from predators looking upward. A flash can confuse an attacker, expose approaching danger, attract a mate, or draw curious prey toward a waiting mouth.",
          },
          {
            id: "counterillumination",
            text: "Most of this light is blue-green, the part of the spectrum that travels best through seawater. Against the faint glow above, a perfectly placed row of photophores can make an animal disappear. In the twilight, survival often depends on producing exactly enough light—not the brightest possible display.",
          },
        ],
      },
      {
        id: "largest-migration",
        journey: { depth: 800, elapsedMinutes: 31, dropVh: 115 },
        traceLabel: "SCATTERING LAYER",
        status: "Ascending at dusk",
        title: "At sunset, a hidden population rises.",
        paragraphs: [
          {
            id: "night-ascent",
            text: "As daylight weakens, countless small fish, squid, shrimp, krill, and gelatinous animals climb toward surface food. Before dawn they descend again, retreating into dim water where visual predators have more difficulty finding them. This diel vertical migration is the largest recurring movement of animals on the planet.",
          },
          {
            id: "moving-carbon",
            text: "The migration moves more than bodies. Animals feed near the surface, carry carbon downward, breathe, excrete, become prey, and sometimes die at depth. Their nightly commute ties the sunlit ocean to the deep and helps determine how long carbon remains away from the atmosphere.",
          },
        ],
      },
    ],
    header: {
      kicker: "Mesopelagic zone · 200–1,000 m",
      title: "Twilight",
      subtitle: "Fading light · Vertical migration · Living signals",
    },
    entry: {
      traceLabel: "DIM-WATER RECORD",
      status: { kind: "text", label: "Dysphotic" },
      title: "A world arranged around the last light.",
      paragraphs: [
        {
          id: "dim-water",
          text: "Crossing two hundred meters feels less like entering darkness than watching certainty dissolve. Day and night still reach this zone, but the remaining light is too faint for photosynthesis. There are no leaves or meadows here; the inhabitants live on matter descending from above or on one another.",
        },
        {
          id: "inhabitants",
          text: "Lanternfish, bristlemouths, hatchetfish, dragonfish, krill, squid, jellies, and comb jellies occupy the open water. Many have oversized eyes tuned to weak light. Others are silver, transparent, red, or nearly black—different solutions to the same problem of being seen in a place where every outline can become evidence.",
        },
        {
          id: "oxygen-and-food",
          text: "Food grows scarcer with depth, and in some regions this layer overlaps an oxygen minimum zone where respiration and decomposition consume oxygen faster than circulation replaces it. Yet sonar reveals that the apparently empty water can hold a dense, shifting community: the deep scattering layer.",
        },
      ],
      tags: {
        ariaLabel: "Twilight zone life",
        items: [
          { id: "lanternfish", label: "Lanternfish" },
          { id: "bristlemouths", label: "Bristlemouths" },
          { id: "gelatinous-life", label: "Jellies & siphonophores" },
        ],
      },
      context: {
        label: "Daily rhythm",
        title: "The deep scattering layer moves like a second horizon.",
        paragraphs: [
          {
            id: "sonar-history",
            text: "Early sonar operators mistook the returning signal for a false seafloor because the layer rose at night and sank during the day. The echo was life reflecting sound.",
          },
          {
            id: "connected-zones",
            text: "Predators including tuna, sharks, dolphins, and whales dive into this layer to feed, proving that the named zones are boundaries for understanding—not walls that animals must obey.",
          },
        ],
      },
    },
  },
  {
    kind: "log",
    id: sectionIds.midnight,
    journey: {
      stratum: { depth: 1000, elapsedMinutes: 38 },
      entry: { depth: 1210, elapsedMinutes: 44 },
      stratumDropVh: 100,
      entryDropVh: 115,
    },
    waypoints: [
      {
        id: "light-made-here",
        journey: { depth: 1900, elapsedMinutes: 65, dropVh: 125 },
        traceLabel: "LIVING LIGHT",
        status: "Local source only",
        title: "Every visible spark belongs to something alive.",
        paragraphs: [
          {
            id: "aphotic-light",
            text: "No sunrise can reach this depth. A pulse in the distance may be a defensive alarm spreading across a jelly, a predator’s lure, a courtship signal, or the blue cloud released by a tubeshoulder fish. Bioluminescence makes darkness active rather than empty.",
          },
          {
            id: "red-vision",
            text: "Most deep animals cannot see red, which makes red bodies appear black. Some dragonfish break that rule: they can produce and detect far-red light, illuminating prey with a private beam that many other inhabitants cannot perceive. Even in total darkness, evolution creates different versions of visibility.",
          },
        ],
      },
      {
        id: "economy-of-food",
        journey: { depth: 2507, elapsedMinutes: 82, dropVh: 135 },
        traceLabel: "FEEDING SIGNAL",
        status: "Food-limited",
        title: "Survival favors patience over pursuit.",
        paragraphs: [
          {
            id: "ambush",
            text: "Chasing prey through cold, food-poor water can cost more energy than the meal returns. Anglerfish and other ambush predators reduce that risk by waiting, drifting, or using light to bring the next opportunity closer. A slow metabolism becomes a way of stretching time between uncertain meals.",
          },
          {
            id: "rare-opportunity",
            text: "Large mouths, recurved teeth, and expandable stomachs appear in several unrelated deep-sea fishes because a rare encounter cannot be wasted. These shapes look extravagant at the surface, but here they are practical answers to long intervals of hunger.",
          },
        ],
      },
      {
        id: "before-the-abyss",
        journey: { depth: 3300, elapsedMinutes: 107, dropVh: 125 },
        traceLabel: "LOWER BOUNDARY",
        status: "Approaching 4,000 m",
        title: "The water seems empty until something moves.",
        paragraphs: [
          {
            id: "sparse-encounters",
            text: "Animals are spread across an enormous volume, so encounters become brief: the outline of a deep jelly, a drifting squid, a fish holding perfectly still, then darkness again. Low density does not mean lifelessness; it means the observer must stop expecting a crowded reef.",
          },
          {
            id: "continuous-descent",
            text: "Marine snow continues through the black water, consumed and repackaged repeatedly on its way down. Most particles will never reach the seafloor. What survives carries a faint chemical record of sunlight into a realm that has never seen it.",
          },
        ],
      },
    ],
    header: {
      kicker: "Bathypelagic zone · 1,000–4,000 m",
      title: "Midnight",
      subtitle: "Permanent night · Cold water · Patient predators",
    },
    entry: {
      traceLabel: "APHOTIC RECORD",
      status: { kind: "text", label: "No surface light" },
      title: "Night without an opposite.",
      paragraphs: [
        {
          id: "permanent-darkness",
          text: "At one thousand meters, the last trace of sunlight is gone. There is no dawn, weather, moon, or season visible from here. The bathypelagic ocean extends for another three kilometers, a volume of cold black water larger than the familiar living space above it.",
        },
        {
          id: "pressure-and-cold",
          text: "Temperature settles near four degrees Celsius in much of the deep ocean, while pressure at the upper boundary is already roughly one hundred times sea-level pressure and continues climbing. Gas-filled spaces become liabilities. Bodies are soft, chemistry is pressure-adapted, and every movement must justify its energy cost.",
        },
        {
          id: "midnight-life",
          text: "Anglerfish, dragonfish, viperfish, gulper eels, deep jellies, squid, and delicate colonial animals move through this apparent emptiness. Some hunt. Some filter falling particles. Some wait for accidents from above. All live in a system whose original energy was mostly captured far away in the sunlight zone.",
        },
      ],
      tags: {
        ariaLabel: "Midnight zone life",
        items: [
          { id: "anglerfish", label: "Anglerfish" },
          { id: "dragonfish", label: "Dragonfish" },
          { id: "deep-jellies", label: "Deep jellies" },
        ],
      },
      context: {
        label: "Pressure record",
        title: "The deep ocean is not hostile to the life that belongs here.",
        paragraphs: [
          {
            id: "adapted-bodies",
            text: "Pressure is dangerous to a surface organism because its body was built for the surface. Deep-sea species evolved proteins, membranes, tissues, and behaviors that function under their native conditions.",
          },
          {
            id: "human-limit",
            text: "It is the visitor—diver, camera housing, viewport, cable, and submarine—who must carry a protected pocket of surface conditions into this world.",
          },
        ],
      },
    },
  },
  {
    kind: "protocol",
    id: sectionIds.abyss,
    journey: {
      stratum: { depth: 4000, elapsedMinutes: 128 },
      entry: { depth: 4050, elapsedMinutes: 130 },
      stratumDropVh: 115,
      entryDropVh: 55,
    },
    waypoints: [
      {
        id: "abyssal-plain",
        journey: { depth: 5200, elapsedMinutes: 151, dropVh: 96 },
        traceLabel: "SEAFLOOR RECORD",
        status: "Sediment field",
        title: "The plain is written in falling particles.",
        paragraphs: [
          {
            id: "sediment",
            text: "The abyssal plain looks smooth from far above, but its sediment is a layered archive. Dust blown from continents, microscopic shells, volcanic ash, minerals, and organic remains settle slowly across the floor. A footprint or feeding trail may persist because there is little current to erase it.",
          },
          {
            id: "deposit-feeders",
            text: "Sea cucumbers move across the mud, taking sediment into their bodies and extracting the small amount of nutrition attached to each grain. Brittle stars, worms, crustaceans, anemones, and single-celled organisms occupy the same plain, often separated by long stretches that seem vacant to a camera.",
          },
          {
            id: "dumbo-octopus",
            text: "A dumbo octopus may rise from the bottom and travel with slow movements of its ear-like fins. With no gas-filled swim bladder and no need to return to the surface, it belongs to the pressure in a way the descending vehicle never can.",
          },
        ],
      },
      {
        id: "rare-feast",
        journey: { depth: 5700, elapsedMinutes: 164, dropVh: 72 },
        traceLabel: "FALL EVENT",
        status: "Localized abundance",
        title: "In a hungry landscape, a carcass becomes an island.",
        paragraphs: [
          {
            id: "arrival",
            text: "Most food arrives as tiny, scattered fragments, but occasionally a large fish, shark, squid, or whale reaches the bottom. Scavengers detect the change and converge. What was an empty-looking patch of mud becomes a concentrated feeding ground.",
          },
          {
            id: "succession",
            text: "Different communities follow one another as soft tissue disappears, smaller animals work through the enriched sediment, and microbes draw energy from compounds locked inside bone. The event is temporary, yet in the abyss even a temporary surplus can reshape life across the surrounding plain.",
          },
        ],
      },
    ],
    header: {
      kicker: "Abyssopelagic zone · 4,000–6,000 m",
      title: "Abyss",
      subtitle: "Near-freezing water · Abyssal plains · Falling food",
    },
    entry: {
      traceLabel: "ABYSSAL PROTOCOL",
      status: { kind: "count", singular: "observation", plural: "observations" },
      title: "Five observations from the wide deep.",
      items: [
        {
          id: "sunlight-is-distant",
          title: "Sunlight is now four kilometers away.",
          description:
            "The abyss receives no light from the sky. Any visible glow is made by an organism or carried by the submersible. Photosynthesis is impossible, so the ecosystem cannot manufacture its own food from sunlight.",
        },
        {
          id: "cold-and-pressure",
          title: "Cold and pressure define every body.",
          description:
            "Water remains only a little above freezing while pressure reaches hundreds of atmospheres. Life persists through pressure-adapted chemistry, slow growth, low energy use, and bodies without compressible air spaces.",
        },
        {
          id: "surface-energy",
          title: "The surface still pays the energy bill.",
          description:
            "Marine snow is the ordinary ration: plankton remains, waste, mucus, microbes, and mineral grains joined into sinking aggregates. Much is eaten on the way down, so only a small fraction of surface production reaches abyssal depth.",
        },
        {
          id: "vast-plain",
          title: "The seafloor opens into a vast plain.",
          description:
            "Beyond continental slopes, fine sediment covers broad stretches of ocean floor. The landscape appears featureless at human scale, yet tracks, burrows, feeding marks, nodules, falls, and small rises create habitat for animals living on and within the mud.",
        },
        {
          id: "patient-life",
          title: "Life answers scarcity with patience.",
          description:
            "Sea cucumbers, brittle stars, worms, crustaceans, cusk eels, dumbo octopuses, sponges, and anemones survive without crowding the frame. The abyss is alive, but its life is spread thinly across an immense three-dimensional world.",
        },
      ],
    },
  },
  {
    kind: "specimen",
    id: sectionIds.hadal,
    journey: {
      stratum: { depth: 6000, elapsedMinutes: 172 },
      entry: { depth: 7400, elapsedMinutes: 184 },
      stratumDropVh: 125,
      entryDropVh: 145,
    },
    waypoints: [
      {
        id: "below-the-fish-line",
        journey: { depth: 9100, elapsedMinutes: 219, dropVh: 145 },
        traceLabel: "BELOW FISH",
        status: "Invertebrates persist",
        title: "Below the fish line, the trench is not empty.",
        paragraphs: [
          {
            id: "fish-limit",
            text: "Hadal snailfish are extraordinary, but fish do not continue to the deepest floor. Observations place their practical lower boundary near eight to a little over eight kilometers. Below that range, the pressure appears to exceed what fish biochemistry can tolerate.",
          },
          {
            id: "amphipod-depth",
            text: "Amphipods continue downward in numbers. They gather around bait, consume carrion and detritus, and become an important link between falling material and larger hadal predators. Their presence beyond the fish line makes the deepest water quieter, not vacant.",
          },
          {
            id: "other-life",
            text: "Sea cucumbers, worms, isopods, and microbial communities also occupy trench sediments and slopes. The cast changes with depth, geography, food supply, and geology; there is no single creature list that describes every trench.",
          },
        ],
      },
      {
        id: "trench-funnel",
        journey: { depth: 10300, elapsedMinutes: 242, dropVh: 125 },
        traceLabel: "TRENCH FUNNEL",
        status: "Near bottom",
        title: "The trench collects the history of the water above.",
        paragraphs: [
          {
            id: "down-slope",
            text: "Steep walls guide sediment, carcasses, and organic particles downward. Earthquakes and slope failures can move material suddenly; ordinary gravity works more quietly every day. The geometry of the trench concentrates food that would be spread more thinly across a flat abyssal plain.",
          },
          {
            id: "pressure",
            text: "Near ten kilometers, pressure approaches a thousand times that at sea level. The number sounds violent, yet it is steady rather than explosive. Native organisms carry the same pressure inside and outside their tissues; the challenge is keeping membranes and proteins functional under that load.",
          },
          {
            id: "unfinished-map",
            text: "A lander can photograph a few square meters, sample a patch of mud, and listen for hours while the trench continues beyond its lights. Every observation is a narrow window into a habitat that remains difficult to reach and impossible to understand from a single descent.",
          },
        ],
      },
    ],
    header: {
      kicker: "Hadalpelagic zone · 6,000–11,000 m",
      title: "Hadal",
      subtitle: "Ocean trenches · Extreme pressure · Life at the limit",
    },
    entry: {
      traceLabel: "TRENCH RECORD",
      status: { kind: "text", label: "Hadal" },
      title: "The ocean narrows into trenches.",
      paragraphs: [
        {
          id: "geometry",
          text: "The hadal zone does not form a continuous global layer like the waters above it. It exists where tectonic plates bend into long, steep trenches. Each trench is partly isolated, with its own shape, sediment, circulation, disturbances, and communities descending from six thousand meters toward the deepest known ocean floor.",
        },
        {
          id: "conditions",
          text: "There is no sunlight, the water hovers just above freezing, and pressure rises from roughly six hundred atmospheres toward more than one thousand. The trench walls create a gradient of conditions and a patchwork of ledges, slopes, and sediment basins rather than one simple vertical shaft.",
        },
        {
          id: "funnel",
          text: "The same shape that makes trenches deep can make parts of them unexpectedly food-rich. Organic material travels downslope and gathers in depressions, allowing specialized animals and microbes to live at depths once assumed sterile. The hadal story is not life surviving nothing; it is life finding the few places where something accumulates.",
        },
      ],
      items: [
        {
          id: "hadal-snailfish",
          title: "Hadal snailfish",
          signal: "Observed at 8,336 m",
          description:
            "Pale hadal snailfish live far deeper than most vertebrates. A specimen filmed in the Izu–Ogasawara Trench at 8,336 meters holds the deepest visual record for a fish, yet even these specialists disappear before the deepest trench floor.",
        },
        {
          id: "amphipods",
          title: "Amphipods",
          signal: "Abundant beyond fish",
          description:
            "Shrimp-like amphipods occur from beaches to the greatest trenches. In hadal water they are scavengers and prey, rapidly gathering around food falls and remaining active at pressures that exclude every known fish.",
        },
        {
          id: "sea-cucumbers",
          title: "Sea cucumbers",
          signal: "Sediment recyclers",
          description:
            "Hadal sea cucumbers gather organic particles from the bottom and return processed sediment behind them. Their soft bodies contain no lungs or large gas spaces, and their feeding helps recycle the trench’s limited supply of usable material.",
        },
        {
          id: "microbial-life",
          title: "Microbial life",
          signal: "Invisible metabolism",
          description:
            "Microbes occupy water, sediment, animal bodies, and buried organic matter. They decompose what falls, transform nutrients, and support processes that remain invisible to a camera even when no larger animal crosses the lights.",
        },
      ],
    },
  },
] as const satisfies readonly PortfolioSection[];
