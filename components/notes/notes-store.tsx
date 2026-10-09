"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { NoteCategory, StudentNote } from "@/lib/types";
import { CURRENT_SSM_ID, SEED_NOTES } from "@/lib/notes-data";

/*
 * Prototype-only notes store. There is no backend, so notes live in React
 * state and are mirrored to localStorage, which lets a note added on a
 * student profile show up on the My Notes page. Production replaces this
 * with the notes API.
 */

const STORAGE_KEY = "ngt-demo-student-notes-v1";

interface NotesApi {
  notes: StudentNote[];
  add: (studentId: string, body: string, category: NoteCategory) => void;
  update: (id: string, patch: Pick<StudentNote, "body" | "category">) => void;
  remove: (id: string) => StudentNote | undefined;
  restore: (note: StudentNote) => void;
  togglePin: (id: string) => void;
}

const NotesContext = createContext<NotesApi | null>(null);

function load(): StudentNote[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentNote[]) : null;
  } catch {
    return null;
  }
}

function save(notes: StudentNote[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    /* storage unavailable (private mode etc.): keep in memory only */
  }
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<StudentNote[]>(SEED_NOTES);
  const [loaded, setLoaded] = useState(false);

  // Read saved notes after mount so server and client render the same seed first.
  useEffect(() => {
    const saved = load();
    if (saved) setNotes(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) save(notes);
  }, [notes, loaded]);

  const add = useCallback((studentId: string, body: string, category: NoteCategory) => {
    const note: StudentNote = {
      id: `n-${Date.now()}`,
      studentId,
      authorSsmId: CURRENT_SSM_ID,
      category,
      body: body.trim(),
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    setNotes((cur) => [note, ...cur]);
  }, []);

  const update = useCallback((id: string, patch: Pick<StudentNote, "body" | "category">) => {
    setNotes((cur) =>
      cur.map((n) =>
        n.id === id ? { ...n, ...patch, body: patch.body.trim(), updatedAt: new Date().toISOString() } : n
      )
    );
  }, []);

  const remove = useCallback(
    (id: string) => {
      const removed = notes.find((n) => n.id === id);
      setNotes((cur) => cur.filter((n) => n.id !== id));
      return removed;
    },
    [notes]
  );

  const restore = useCallback((note: StudentNote) => {
    setNotes((cur) => (cur.some((n) => n.id === note.id) ? cur : [note, ...cur]));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes((cur) => cur.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }, []);

  const api = useMemo(
    () => ({ notes, add, update, remove, restore, togglePin }),
    [notes, add, update, remove, restore, togglePin]
  );

  return <NotesContext.Provider value={api}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside <NotesProvider>");
  return ctx;
}

/** Pinned first, then newest first. */
export function sortNotes(notes: StudentNote[]) {
  return [...notes].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt)
  );
}

/** Case-insensitive match on every word of the query against the given haystack fields. */
export function matchesQuery(query: string, ...fields: (string | undefined)[]) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = fields.filter(Boolean).join(" ").toLowerCase();
  return words.every((w) => hay.includes(w));
}
