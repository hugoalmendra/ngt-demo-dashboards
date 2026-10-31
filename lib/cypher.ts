// =====================================================================
// Cypher (AI study assistant) — prototype data + daily message credits.
// Production: credits are enforced server-side; this mirrors the UX only.
// =====================================================================

export const CYPHER_DAILY_LIMIT = 5;

export const CYPHER_PROMPTS = [
  "When will I land an IT Job?",
  "How much will I make when I finish the FSNE+CS program?",
  "Which skill should I focus on first?",
  "How many hours should I be studying each day?",
];

const CANNED: Record<string, string> = {
  "When will I land an IT Job?":
    "Most students who finish their FSNA and keep up with milestones start interviewing within 3–6 months. The biggest lever is consistency: finish your current course, then book a call with Career Success to polish your résumé.",
  "How much will I make when I finish the FSNE+CS program?":
    "Pay depends on your location, experience and the role you land. Your Career Success coach can walk you through realistic ranges for your area once you're close to finishing.",
  "Which skill should I focus on first?":
    "Start with networking fundamentals (IP addressing, subnetting, routing). Everything else in the program, including security, builds on them. You're in CompTIA Security+ now, so review subnetting whenever a lesson feels fuzzy.",
  "How many hours should I be studying each day?":
    "Aim for 1–2 focused hours a day, 5 days a week. Short daily sessions beat long weekend marathons, and they keep you on pace for your milestones.",
};

export function cypherReply(question: string) {
  return (
    CANNED[question] ??
    "Great question! Based on your current course, I'd start by reviewing the lesson resources, then try the practice quiz. Want me to break the topic down step by step?"
  );
}

export interface CypherMessage {
  id: string;
  role: "user" | "cypher";
  text: string;
}

/** Local calendar day, e.g. "2026-10-31". Credits reset when this changes. */
export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "5h 12m" until local midnight. */
export function timeUntilReset(now = new Date()) {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const mins = Math.max(1, Math.ceil((midnight.getTime() - now.getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
