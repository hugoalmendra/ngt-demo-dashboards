export const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatShortDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDelta = (days: number) => {
  if (days === 0) return "On schedule";
  if (days > 0) return `${days}d ahead`;
  return `${Math.abs(days)}d behind`;
};

export const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${formatDate(iso)} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
};
