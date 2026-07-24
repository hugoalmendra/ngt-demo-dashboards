export type PyramidVisual = "fsna" | "vendor-badges" | "ngt-badges" | "text";

export interface CareerStage {
  id: number;
  label: string;
  title: string;
  description: string;
  pyramidLabel: string;
  pyramidDetail?: string;
  pyramidVisual: PyramidVisual;
  timeline: string;
  outcomeLabel: string;
  outcome: string;
  certifications?: string[];
  roleFocus?: string[];
}

/** Front-face width (px) per stage — base is widest, peak is narrowest. */
export const PYRAMID_LAYER_WIDTHS = [300, 268, 236, 204, 172, 140, 108];

/** Layer height (px) — base tier is taller for the FSNA badge. */
export const PYRAMID_LAYER_HEIGHTS = [64, 48, 48, 40, 40, 36, 34];

export const CAREER_STAGES: CareerStage[] = [
  {
    id: 1,
    label: "Stage 01",
    title: "The Foundation",
    description:
      "This is where your transformation begins. Build a rock-solid foundation with FSNA certifications covering 100 real-world IT skills employers actually look for.",
    pyramidLabel: "FSNA CERTIFIED",
    pyramidVisual: "fsna",
    timeline: "Start now",
    outcomeLabel: "Outcome",
    outcome: "Job Ready",
    certifications: ["FSNA"],
  },
  {
    id: 2,
    label: "Stage 02",
    title: "1st IT Job",
    description:
      "Land your first IT position within 2–4 months after graduating. With industry certifications and hands-on project experience, you'll stand out from other candidates.",
    pyramidLabel: "Industry Certs",
    pyramidDetail: "Network+ · CCNA · Security+",
    pyramidVisual: "vendor-badges",
    timeline: "2–4 months",
    outcomeLabel: "Avg. salary",
    outcome: "$85K",
    certifications: ["Network+", "CCNA", "Security+"],
  },
  {
    id: 3,
    label: "Stage 03",
    title: "The Promotion",
    description:
      "With advanced certifications and proven experience, you'll be positioned for promotions and higher-paying roles.",
    pyramidLabel: "Advanced Certs",
    pyramidDetail: "FSNP · NCSA · AIS",
    pyramidVisual: "ngt-badges",
    timeline: "6–18 months",
    outcomeLabel: "Avg. salary",
    outcome: "$100K – $200K",
    certifications: ["FSNP", "NCSA", "AIS"],
  },
  {
    id: 4,
    label: "Stage 04",
    title: "Level Up",
    description:
      "Take on senior roles and lead real projects. With 3–4 years of experience and advanced skills, you become the go-to expert on your team.",
    pyramidLabel: "SR ROLE + 3 PROJECTS",
    pyramidVisual: "text",
    timeline: "3–4 years",
    outcomeLabel: "Avg. salary",
    outcome: "$200K – $300K",
    roleFocus: ["Senior Role", "3+ Projects"],
  },
  {
    id: 5,
    label: "Stage 05",
    title: "Stability",
    description:
      "Reach Architect or Director/VP Management level. At 5+ years, you command top compensation and shape the technology strategy for organizations.",
    pyramidLabel: "ARCHITECT OR DIR/VP MANAGEMENT",
    pyramidVisual: "text",
    timeline: "5+ years",
    outcomeLabel: "Avg. salary",
    outcome: "$300K+ total compensation",
    roleFocus: ["Architect", "Dir/VP"],
  },
  {
    id: 6,
    label: "Stage 06",
    title: "Expert",
    description:
      "Become a recognized industry consultant. Companies pay premium rates for your specialized knowledge and strategic guidance.",
    pyramidLabel: "CONSULTANT",
    pyramidVisual: "text",
    timeline: "6+ years",
    outcomeLabel: "Avg. salary",
    outcome: "$500K+ total compensation",
    roleFocus: ["Consultant", "Industry Expert"],
  },
  {
    id: 7,
    label: "Stage 07",
    title: "Start your own IT Business",
    description:
      "The ultimate destination — launch your own LLC. With 7+ years of experience and deep industry relationships, build a business that generates millions.",
    pyramidLabel: "LLC",
    pyramidVisual: "text",
    timeline: "7+ years",
    outcomeLabel: "Avg. salary",
    outcome: "Millions",
    roleFocus: ["LLC", "Consulting firm", "MSP"],
  },
];
