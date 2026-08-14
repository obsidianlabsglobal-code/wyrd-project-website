/**
 * Every fact here comes from the supplied WYRD brand material.
 * Nothing about clients, awards, statistics, team members or history is
 * invented — where the brand material is silent, the site stays silent.
 */

export const brand = {
  name: "WYRD Designs",
  location: "Bangalore, India",
  type: "Design and technology studio",
  positioning:
    "WYRD Designs operates at the intersection of design and technology — not simply a design agency, not simply a software company.",
  email: "hello@wyrddesigns.in",
  phone: "+91-8217618082",
  phoneHref: "+918217618082",
} as const;

export type Domain = {
  index: string;
  title: string;
  note: string;
  accent: string;
};

/** The four domains WYRD's identity sits between, per the brand material. */
export const domains: Domain[] = [
  {
    index: "01",
    title: "Design",
    note: "Form, hierarchy and craft. The part of the work that decides how something is understood before it is used.",
    accent: "var(--coral)",
  },
  {
    index: "02",
    title: "Technology",
    note: "The engineering underneath. Built so it holds up, and so it disappears into the experience.",
    accent: "var(--powder)",
  },
  {
    index: "03",
    title: "Creative thinking",
    note: "Curiosity and experimentation applied deliberately, rather than decoration applied afterwards.",
    accent: "var(--sage)",
  },
  {
    index: "04",
    title: "Digital experiences",
    note: "The result: environments people move through, where design and technology arrive as one thing.",
    accent: "var(--lavender)",
  },
];

export type SystemNode = {
  id: string;
  label: string;
  body: string;
  x: number;
  y: number;
  accent: string;
};

/** IDEA → DESIGN → TECHNOLOGY → PEOPLE → OUTCOME */
export const systemNodes: SystemNode[] = [
  {
    id: "idea",
    label: "Idea",
    body: "Everything starts as a question rather than a deliverable. What is this actually for, and who is it for?",
    x: 12,
    y: 30,
    accent: "var(--butter)",
  },
  {
    id: "design",
    label: "Design",
    body: "The idea is given form — structure, hierarchy, language, material. Design is how the thinking becomes legible.",
    x: 36,
    y: 68,
    accent: "var(--coral)",
  },
  {
    id: "technology",
    label: "Technology",
    body: "Form is made real. Technology is treated as a material with its own grain, not as a layer bolted on at the end.",
    x: 62,
    y: 26,
    accent: "var(--powder)",
  },
  {
    id: "people",
    label: "People",
    body: "Behind the systems are people making judgements. The work is shaped by human intent at every stage.",
    x: 80,
    y: 70,
    accent: "var(--sage)",
  },
  {
    id: "outcome",
    label: "Outcome",
    body: "A digital experience that holds together — considered, built with care, and specific to the problem it answers.",
    x: 94,
    y: 40,
    accent: "var(--lavender)",
  },
];

export const systemEdges: [string, string][] = [
  ["idea", "design"],
  ["design", "technology"],
  ["technology", "people"],
  ["people", "outcome"],
  ["idea", "technology"],
  ["design", "people"],
];

/** Knowledge base for the assistant — strictly the documented facts. */
export const assistantKnowledge = `
COMPANY: ${brand.name}
LOCATION: ${brand.location}
TYPE: ${brand.type}
POSITIONING: ${brand.positioning}
IDENTITY SITS BETWEEN: design, technology, creative thinking, digital experiences.
GUIDING PRINCIPLE: technology should disappear into the experience.
HOW THE STUDIO THINKS: idea, design, technology, people, outcome — one connected system rather than separate stages.
CONTACT EMAIL: ${brand.email}
CONTACT PHONE: ${brand.phone}
`.trim();
