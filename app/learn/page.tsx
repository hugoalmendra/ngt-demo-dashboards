import type { Metadata } from "next";
import { LessonPlayer } from "@/components/lesson-player";
import { PLAYER_MODULE, PLAYER_START_LESSON } from "@/lib/lesson-player";

export const metadata: Metadata = {
  title: "Lesson player — NGT.Academy prototype",
};

// Full-screen like the production player, so it sits outside the student layout.
export default function LearnPage() {
  return <LessonPlayer module={PLAYER_MODULE} startLessonId={PLAYER_START_LESSON} />;
}
