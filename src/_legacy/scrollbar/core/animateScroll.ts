import type { AxisConfig } from "../../types";

export function animateScroll(
  el: HTMLDivElement,
  cfg: AxisConfig,
  target: number,
) {
  const start = el[cfg.scrollPos];
  const max = el[cfg.scrollSize] - el[cfg.clientSize];
  const clamped = Math.max(0, Math.min(target, max));

  const duration = 250;
  const startTime = performance.now();

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(progress);

    el[cfg.scrollPos] = start + (clamped - start) * eased;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}
