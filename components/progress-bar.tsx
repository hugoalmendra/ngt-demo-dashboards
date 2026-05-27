import clsx from "clsx";

interface Props {
  value: number;             // 0..100
  size?: "sm" | "md" | "lg";
  variant?: "yellow" | "green" | "red" | "amber" | "auto";
  showLabel?: boolean;
}

export function ProgressBar({ value, size = "md", variant = "yellow", showLabel }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  let color = "bg-ngt-yellow";
  const v = variant === "auto" ? (pct >= 80 ? "green" : pct >= 50 ? "yellow" : pct >= 20 ? "amber" : "red") : variant;
  if (v === "green") color = "bg-ngt-good";
  if (v === "red") color = "bg-ngt-bad";
  if (v === "amber") color = "bg-ngt-warn";

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={clsx("flex-1 rounded-full bg-ngt-line overflow-hidden", h)}>
        <div className={clsx("h-full rounded-full fill-in", color)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold tabular-nums text-ngt-muted w-9 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
