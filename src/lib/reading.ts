// Reading time for memos. Kept free of server-only imports so the memo page's
// client script (reading progress) can import it too: one speed for the build
// and the browser. Every reading time shown as text carries a tilde; the
// numbers are estimates and must not look exact.

export const WORDS_PER_MINUTE = 200;

/** Whole-memo reading time in minutes, at least 1. */
export const readingMinutesTotal = (words: number) => Math.max(1, Math.round(words / WORDS_PER_MINUTE));

/** Rail label for the time still to read at progress `p` (0–1). */
export const minutesLeftLabel = (words: number, p: number) => {
  const left = Math.round((words * (1 - p)) / WORDS_PER_MINUTE);
  return left > 0 ? `~${left} min left` : 'done';
};
