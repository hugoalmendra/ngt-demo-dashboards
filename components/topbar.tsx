"use client";

import { Bell, Search, Trophy } from "lucide-react";

interface TopbarProps {
  xp?: number;
  ctaLabel?: string;
  rightSearch?: boolean;
}

export function Topbar({ xp = 60375, ctaLabel = "REPORT SUCCESS", rightSearch }: TopbarProps) {
  return (
    <header className="h-[64px] bg-white border-b border-ngt-line flex items-center justify-between px-6 sticky top-0 z-30">
      {rightSearch ? (
        <div className="flex items-center gap-2 w-[420px] max-w-[40vw]">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ngt-muted" />
            <input
              placeholder="Search students, cohorts, certs..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-ngt-line text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
            />
          </div>
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-4">
        <button className="bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[12px] font-bold tracking-widest px-4 h-9 rounded-md transition">
          {ctaLabel}
        </button>
        <div className="flex items-center gap-1 text-ngt-muted text-sm">
          <Trophy size={14} className="text-ngt-yellow" />
          <span className="font-semibold text-ngt-text">{xp.toLocaleString("en-US")}</span>
          <span className="text-[11px] uppercase tracking-widest">XP</span>
        </div>
        <button className="text-ngt-muted hover:text-ngt-text">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-amber-500 text-white grid place-items-center text-xs font-bold">
          HA
        </div>
      </div>
    </header>
  );
}
