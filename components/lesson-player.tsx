"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Captions,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
  CircleHelp,
  Download,
  FileArchive,
  FileCode,
  FileText,
  Film,
  Maximize,
  Mic,
  Network,
  NotebookPen,
  Paperclip,
  Pause,
  Play,
  Settings,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  formatFileSize,
  type Lesson,
  type LessonResource,
  type PlayerModule,
  type ResourceKind,
} from "@/lib/lesson-player";

/*
 * Lesson player with resources shown next to each lesson.
 *
 * Instead of an extra "resources" column (too narrow in a ~420px panel), a
 * lesson that has files gets a 📎 count chip beside its duration. The chip
 * toggles an inline drawer right under that lesson with each file and a
 * download button. The lesson being watched opens its drawer automatically,
 * and the Resources tab under the video leads with "This lesson".
 */

type PanelTab = "lessons" | "cypher" | "notes";
type BottomTab = "resources" | "overview" | "details";

export function LessonPlayer({ module, startLessonId }: { module: PlayerModule; startLessonId: string }) {
  const lessons = useMemo(() => module.sections.flatMap((s) => s.lessons), [module]);
  const [currentId, setCurrentId] = useState(startLessonId);
  // Drawers the student opened by hand stay open. The current lesson's drawer
  // opens by itself and closes again when they move on (unless they hid it).
  const [openFiles, setOpenFiles] = useState<Set<string>>(() => new Set());
  const [currentFilesHidden, setCurrentFilesHidden] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>("lessons");
  const [bottomTab, setBottomTab] = useState<BottomTab>("resources");
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const index = lessons.findIndex((l) => l.id === currentId);
  const current = lessons[index] ?? lessons[0];
  const next = lessons[index + 1];
  const allFiles = lessons.flatMap((l) => l.resources);
  const completedCount = lessons.filter((l) => l.completed).length;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const goTo = (id: string) => {
    setCurrentId(id);
    setPlaying(false);
    setCurrentFilesHidden(false);
  };

  const isFilesOpen = (id: string) => (id === current.id ? !currentFilesHidden : openFiles.has(id));

  const toggleFiles = (id: string) => {
    if (id === current.id) return setCurrentFilesHidden((h) => !h);
    setOpenFiles((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });
  };

  const download = (label: string) => setToast(`Demo only — "${label}" would download here.`);

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-ngt-bg text-ngt-text">
      {/* ---------------- Main column: video + tabs ---------------- */}
      <div className="flex-1 min-w-0 lg:overflow-y-auto">
        <VideoStage
          lesson={current}
          next={next}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
          onNext={() => next && goTo(next.id)}
        />

        <div className="bg-white border-b border-ngt-line">
          <div className="grid grid-cols-3 max-w-4xl mx-auto">
            {(["resources", "overview", "details"] as BottomTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setBottomTab(t)}
                className={clsx(
                  "h-12 text-[12px] font-bold uppercase tracking-widest border-b-[3px] transition",
                  bottomTab === t
                    ? "border-ngt-yellow text-ngt-text"
                    : "border-transparent text-ngt-muted hover:text-ngt-text"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
          {bottomTab === "resources" && (
            <ResourcesTab
              module={module}
              current={current}
              totalFiles={allFiles.length}
              onDownload={download}
              onOpenLesson={goTo}
            />
          )}
          {bottomTab === "overview" && (
            <OverviewTab module={module} completed={completedCount} total={lessons.length} />
          )}
          {bottomTab === "details" && <DetailsTab module={module} />}
        </div>
      </div>

      {/* ---------------- Right panel ---------------- */}
      <aside className="w-full lg:w-[420px] shrink-0 bg-[#2F353C] text-white flex flex-col lg:h-screen">
        <div className="px-5 pt-5 pb-3 text-center">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ngt-yellow">
            {module.courseName}
          </div>
          <div className="text-lg font-semibold mt-1">{module.moduleName}</div>
        </div>
        <div className="grid grid-cols-3 border-b border-white/10">
          <PanelTabButton active={panelTab === "lessons"} onClick={() => setPanelTab("lessons")} icon={<Film size={15} />}>
            Lessons
          </PanelTabButton>
          <PanelTabButton active={panelTab === "cypher"} onClick={() => setPanelTab("cypher")} icon={<Sparkles size={15} />}>
            Cypher
          </PanelTabButton>
          <PanelTabButton active={panelTab === "notes"} onClick={() => setPanelTab("notes")} icon={<NotebookPen size={15} />}>
            Notes
          </PanelTabButton>
        </div>

        <div className="flex-1 overflow-y-auto">
          {panelTab === "lessons" && (
            <>
              <div className="px-5 py-3 flex items-center justify-between gap-3 text-[12px] text-white/60 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5">
                  <Paperclip size={13} /> {allFiles.length} files in this module
                </span>
                <button
                  type="button"
                  onClick={() => download(`All ${allFiles.length} module files (.zip)`)}
                  className="inline-flex items-center gap-1 font-semibold text-ngt-yellow hover:text-white transition"
                >
                  <Download size={13} /> Download all
                </button>
              </div>
              {module.sections.map((section) => (
                <LessonSectionList
                  key={section.id}
                  title={section.title}
                  lessons={section.lessons}
                  currentId={current.id}
                  isFilesOpen={isFilesOpen}
                  onPlay={goTo}
                  onToggleFiles={toggleFiles}
                  onDownload={download}
                />
              ))}
            </>
          )}
          {panelTab === "cypher" && <CypherPanel />}
          {panelTab === "notes" && <NotesPanel />}
        </div>
      </aside>

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-ngt-ink text-white text-[13px] px-4 py-2.5 rounded-md shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Video stage (placeholder for the real player)                       */
/* ------------------------------------------------------------------ */

function VideoStage({
  lesson,
  next,
  playing,
  onTogglePlay,
  onNext,
}: {
  lesson: Lesson;
  next?: Lesson;
  playing: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative aspect-video max-h-[70vh] w-full bg-gradient-to-br from-[#0b1b35] via-[#10284f] to-[#050b16] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#4c7bd9_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
        <Link
          href="/student"
          className="inline-flex items-center gap-1 h-9 px-4 rounded bg-black/60 hover:bg-black/80 text-[12px] font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Go back
        </Link>
        {next && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1 h-9 px-4 rounded bg-black/60 hover:bg-black/80 text-[12px] font-bold uppercase tracking-widest"
          >
            Next lesson <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-ngt-yellow font-bold">
            {lesson.type === "lab" ? "Hands-on lab" : lesson.type === "review" ? "Review" : "Lesson"}
          </div>
          <div className="text-2xl md:text-4xl font-black mt-2">{lesson.title}</div>
          {lesson.resources.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-white/70">
              <Paperclip size={13} /> {lesson.resources.length} file{lesson.resources.length > 1 ? "s" : ""} for
              this lesson — see the Lessons panel or Resources tab
            </div>
          )}
        </div>
      </div>

      {/* Control bar */}
      <div className="absolute bottom-0 inset-x-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4">
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="w-12 h-9 rounded bg-ngt-yellow text-black grid place-items-center shrink-0"
        >
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <div className="flex-1 h-1 rounded-full bg-white/25 relative">
          <div className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-ngt-yellow" />
        </div>
        <div className="hidden sm:flex items-center gap-3 text-white/80">
          <Volume2 size={16} />
          <Captions size={16} />
          <Settings size={16} />
          <Maximize size={16} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lessons panel                                                       */
/* ------------------------------------------------------------------ */

function LessonSectionList({
  title,
  lessons,
  currentId,
  isFilesOpen,
  onPlay,
  onToggleFiles,
  onDownload,
}: {
  title: string;
  lessons: Lesson[];
  currentId: string;
  isFilesOpen: (id: string) => boolean;
  onPlay: (id: string) => void;
  onToggleFiles: (id: string) => void;
  onDownload: (label: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        className="w-full px-5 py-4 flex items-center justify-between text-[13px] font-bold uppercase tracking-wide text-white/90 hover:bg-white/[0.03]"
      >
        {title}
        <ChevronDown size={16} className={clsx("transition-transform", !collapsed && "rotate-180")} />
      </button>
      {!collapsed && (
        <ul className="pb-2">
          {lessons.map((l) => (
            <LessonRow
              key={l.id}
              lesson={l}
              isCurrent={l.id === currentId}
              filesOpen={isFilesOpen(l.id)}
              onPlay={() => onPlay(l.id)}
              onToggleFiles={() => onToggleFiles(l.id)}
              onDownload={onDownload}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function LessonRow({
  lesson,
  isCurrent,
  filesOpen,
  onPlay,
  onToggleFiles,
  onDownload,
}: {
  lesson: Lesson;
  isCurrent: boolean;
  filesOpen: boolean;
  onPlay: () => void;
  onToggleFiles: () => void;
  onDownload: (label: string) => void;
}) {
  const n = lesson.resources.length;
  const drawerId = `files-${lesson.id}`;
  return (
    <li className={clsx(isCurrent && "bg-white/[0.06]")}>
      <div className="flex items-center gap-3 pl-5 pr-4 py-2.5">
        <LessonStatusIcon lesson={lesson} isCurrent={isCurrent} />
        <button
          type="button"
          onClick={onPlay}
          aria-current={isCurrent ? "true" : undefined}
          className={clsx(
            "flex-1 min-w-0 text-left text-[14px] leading-snug hover:text-ngt-yellow transition",
            isCurrent ? "text-white font-semibold" : "text-white/80"
          )}
        >
          {lesson.title}
        </button>
        {n > 0 && (
          <button
            type="button"
            onClick={onToggleFiles}
            aria-expanded={filesOpen}
            aria-controls={drawerId}
            title={`${filesOpen ? "Hide" : "Show"} ${n} file${n > 1 ? "s" : ""}`}
            className={clsx(
              "shrink-0 inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-bold tabular-nums transition",
              filesOpen
                ? "bg-ngt-yellow text-black"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
            )}
          >
            <Paperclip size={12} /> {n}
          </button>
        )}
        {lesson.duration && (
          <span className="shrink-0 w-11 text-right text-[13px] tabular-nums text-white/70">{lesson.duration}</span>
        )}
      </div>

      {n > 0 && filesOpen && (
        <div id={drawerId} className="ml-12 mr-4 mb-3 rounded-md border border-white/10 bg-black/20 overflow-hidden">
          <ul>
            {lesson.resources.map((r) => (
              <li key={r.id} className="border-b border-white/5 last:border-b-0">
                <button
                  type="button"
                  onClick={() => onDownload(r.name)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.06] group"
                >
                  <FileIcon kind={r.kind} className="text-ngt-yellow shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-[13px] text-white/90" title={r.name}>
                    {r.name}
                  </span>
                  <span className="text-[11px] text-white/40 tabular-nums shrink-0">{formatFileSize(r.sizeKb)}</span>
                  <Download size={14} className="text-white/50 group-hover:text-ngt-yellow shrink-0" />
                </button>
              </li>
            ))}
          </ul>
          {n > 1 && (
            <button
              type="button"
              onClick={() => onDownload(`${lesson.title} — ${n} files (.zip)`)}
              className="w-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-ngt-yellow hover:bg-white/[0.06] border-t border-white/10 inline-flex items-center justify-center gap-1.5"
            >
              <Download size={12} /> Download all {n}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function LessonStatusIcon({ lesson, isCurrent }: { lesson: Lesson; isCurrent: boolean }) {
  if (lesson.type === "review") return <CircleHelp size={16} className="text-ngt-yellow shrink-0" />;
  if (isCurrent) return <CircleDot size={16} className="text-white shrink-0" />;
  if (lesson.completed) return <Check size={16} strokeWidth={3} className="text-ngt-yellow shrink-0" />;
  return <Circle size={16} className="text-white/40 shrink-0" />;
}

function FileIcon({ kind, className }: { kind: ResourceKind; className?: string }) {
  const size = 15;
  if (kind === "pkt") return <Network size={size} className={className} />;
  if (kind === "zip") return <FileArchive size={size} className={className} />;
  if (kind === "txt") return <FileCode size={size} className={className} />;
  return <FileText size={size} className={className} />;
}

function PanelTabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "h-12 inline-flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wide border-b-[3px] transition",
        active ? "border-ngt-yellow text-ngt-yellow" : "border-transparent text-white/70 hover:text-white"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs under the video                                                */
/* ------------------------------------------------------------------ */

function ResourcesTab({
  module,
  current,
  totalFiles,
  onDownload,
  onOpenLesson,
}: {
  module: PlayerModule;
  current: Lesson;
  totalFiles: number;
  onDownload: (label: string) => void;
  onOpenLesson: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* This lesson first — the files students need right now */}
      <section className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-ngt-line">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">This lesson</div>
            <div className="font-bold mt-0.5">{current.title}</div>
          </div>
          {current.resources.length > 1 && (
            <button
              type="button"
              onClick={() => onDownload(`${current.title} — ${current.resources.length} files (.zip)`)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold uppercase tracking-widest"
            >
              <Download size={13} /> Download {current.resources.length} files
            </button>
          )}
        </div>
        {current.resources.length > 0 ? (
          <FileList files={current.resources} onDownload={onDownload} />
        ) : (
          <p className="px-5 py-4 text-[13px] text-ngt-muted">No files for this lesson.</p>
        )}
      </section>

      {/* Everything else, grouped by section → lesson (only lessons that have files) */}
      <section className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-ngt-line">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">All module files</div>
            <div className="text-[13px] text-ngt-muted mt-0.5">
              {totalFiles} files · download individually, by lesson, or all at once
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDownload(`All ${totalFiles} module files (.zip)`)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-ngt-line hover:border-ngt-yellow text-[11px] font-bold uppercase tracking-widest"
          >
            <Download size={13} /> Download all
          </button>
        </div>
        {module.sections.map((section) => {
          const withFiles = section.lessons.filter((l) => l.resources.length > 0);
          if (withFiles.length === 0) return null;
          return (
            <div key={section.id} className="border-b border-ngt-line last:border-b-0">
              <div className="px-5 pt-4 pb-1 text-[11px] uppercase tracking-widest font-bold text-ngt-muted">
                {section.title}
              </div>
              {withFiles.map((l) => (
                <div key={l.id} className="px-5 py-2">
                  <button
                    type="button"
                    onClick={() => onOpenLesson(l.id)}
                    className={clsx(
                      "text-[14px] font-semibold hover:text-ngt-yellowDark transition",
                      l.id === current.id && "text-ngt-yellowDark"
                    )}
                  >
                    {l.title}
                    {l.id === current.id && <span className="ml-2 text-[11px] font-bold uppercase tracking-widest">· Now playing</span>}
                  </button>
                  <FileList files={l.resources} onDownload={onDownload} compact />
                </div>
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function FileList({
  files,
  onDownload,
  compact,
}: {
  files: LessonResource[];
  onDownload: (label: string) => void;
  compact?: boolean;
}) {
  return (
    <ul className={clsx(compact ? "mt-1 mb-2" : "divide-y divide-ngt-line")}>
      {files.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => onDownload(r.name)}
            className={clsx(
              "w-full flex items-center gap-3 text-left hover:bg-ngt-bg group rounded",
              compact ? "px-2 py-1.5" : "px-5 py-3"
            )}
          >
            <FileIcon kind={r.kind} className="text-ngt-muted shrink-0" />
            <span className="flex-1 min-w-0 truncate text-[14px]">{r.name}</span>
            <span className="text-[12px] text-ngt-muted tabular-nums">{formatFileSize(r.sizeKb)}</span>
            <Download size={15} className="text-ngt-muted group-hover:text-ngt-yellowDark shrink-0" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function OverviewTab({ module, completed, total }: { module: PlayerModule; completed: number; total: number }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="space-y-5">
      <section className="bg-white border border-ngt-line rounded-lg shadow-card p-6">
        <div className="flex items-baseline justify-between text-[14px]">
          <span>{pct}% complete</span>
          <span className="text-[13px] text-ngt-muted">{total - completed} lessons to complete</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-ngt-bg overflow-hidden">
          <div className="h-full bg-ngt-yellow rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </section>
      <section className="bg-white border border-ngt-line rounded-lg shadow-card p-6">
        <h3 className="font-bold">About</h3>
        <p className="text-[14px] text-ngt-muted mt-3 leading-relaxed">{module.about}</p>
      </section>
    </div>
  );
}

function DetailsTab({ module }: { module: PlayerModule }) {
  return (
    <section className="bg-white border border-ngt-line rounded-lg shadow-card divide-y divide-ngt-line">
      {module.sections.map((s) => (
        <div key={s.id} className="px-5 py-4 flex items-center justify-between">
          <span className="font-semibold">{s.title}</span>
          <span className="text-[13px] text-ngt-muted">{s.lessons.length} lessons</span>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cypher + Notes (visual placeholders, as in production)              */
/* ------------------------------------------------------------------ */

function CypherPanel() {
  const prompts = [
    "When will I land an IT Job?",
    "How much will I make when I finish the FSNE+CS program?",
    "Which skill should I focus on first?",
    "How many hours should I be studying each day?",
  ];
  return (
    <div className="bg-white text-ngt-text min-h-full flex flex-col">
      <div className="flex-1 px-4 py-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-ngt-yellow grid place-items-center">
          <Sparkles size={34} className="text-black" />
        </div>
        <div className="text-2xl font-bold mt-4">Hi, I&apos;m Cypher</div>
        <p className="text-[14px] text-ngt-muted mt-1">and I&apos;m here to help you level up your career!</p>
        <div className="grid grid-cols-2 gap-2 mt-6">
          {prompts.map((p) => (
            <div key={p} className="border border-ngt-line rounded-md px-3 py-4 text-[13px] leading-snug">
              {p}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-ngt-line">
        <div className="h-11 rounded-md border border-ngt-line px-3 flex items-center justify-between text-[14px] text-ngt-muted">
          Ask me anything <Mic size={16} />
        </div>
      </div>
    </div>
  );
}

function NotesPanel() {
  const [note, setNote] = useState("");
  return (
    <div className="bg-white text-ngt-text min-h-full flex flex-col">
      <div className="flex-1 grid place-items-center px-8 text-center">
        <div>
          <NotebookPen size={56} className="mx-auto text-ngt-line" />
          <p className="text-[14px] text-ngt-muted mt-4">
            Now you can take your own notes! You can keep track of all your notes on your dashboard.
          </p>
          <span className="inline-block mt-2 font-bold text-ngt-yellowDark">View all notes</span>
        </div>
      </div>
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-widest font-bold text-ngt-muted mb-2">Add your note here</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-ngt-line p-3 text-[14px] outline-none focus:border-ngt-yellow"
        />
        <button
          type="button"
          disabled={!note.trim()}
          className="mt-2 h-9 px-5 rounded-md bg-ngt-yellow disabled:bg-ngt-line disabled:text-ngt-muted text-black text-[11px] font-bold uppercase tracking-widest"
        >
          Save note
        </button>
      </div>
    </div>
  );
}
