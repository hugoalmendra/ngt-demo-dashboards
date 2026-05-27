import clsx from "clsx";

interface Props {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: "yellow" | "green" | "red" | "blue" | "neutral";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  yellow: "bg-ngt-yellow/15 text-ngt-yellowDark",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-rose-50 text-rose-600",
  blue: "bg-sky-50 text-sky-600",
  neutral: "bg-ngt-bg text-ngt-muted",
};

export function StatCard({ label, value, sub, icon, accent = "neutral" }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ngt-line p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
          {label}
        </div>
        {icon && (
          <div className={clsx("w-7 h-7 rounded-md grid place-items-center", ACCENTS[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold tabular-nums leading-none">{value}</div>
      {sub && <div className="text-[11px] text-ngt-muted mt-1.5">{sub}</div>}
    </div>
  );
}
