// =====================================================================
// Cypher (AI study assistant) — prototype data + daily message credits.
// Production: credits are enforced server-side; this mirrors the UX only.
// Every message the student sends uses a credit (typed, dictated or a
// suggested question). There are no extra credits and no staff exemption.
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

/** Credits reset for everyone at midnight US Eastern (server time in production). */
export const CYPHER_RESET_TZ = "America/New_York";

/** Calendar day in the reset time zone, e.g. "2026-10-31". Credits reset when this changes. */
export function todayKey(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CYPHER_RESET_TZ }).format(d);
}

/** Minutes until the next midnight in the reset time zone. */
function minutesUntilReset(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CYPHER_RESET_TZ,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const elapsed = get("hour") * 3600 + get("minute") * 60 + get("second");
  return Math.max(1, Math.ceil((86400 - elapsed) / 60));
}

/** Countdown ("5h 12m") and the reset moment in the student's own time ("9:00 PM"). */
export function cypherReset(now = new Date()) {
  const mins = minutesUntilReset(now);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const at = new Date(now.getTime() + mins * 60000);
  at.setSeconds(0, 0);
  return {
    in: h > 0 ? `${h}h ${m}m` : `${m}m`,
    at: at.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}
