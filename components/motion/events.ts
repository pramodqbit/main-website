/** Window events shared by the story layer. */
export const INTRO_DONE = "qb:intro-done";
export const BITS_BURST = "qb:bits-burst";

/** True while the home-page intro overlay owns the screen. */
export function introPlaying(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("qb-intro");
}

/** Run `fn` now, or once the intro has finished. Returns a cleanup. */
export function afterIntro(fn: () => void): () => void {
  if (!introPlaying()) {
    fn();
    return () => {};
  }
  const handler = () => fn();
  window.addEventListener(INTRO_DONE, handler, { once: true });
  return () => window.removeEventListener(INTRO_DONE, handler);
}
