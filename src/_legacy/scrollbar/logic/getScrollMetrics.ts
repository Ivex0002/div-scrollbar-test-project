import type { AxisConfig, ScrollMetrics } from "../../types";

export function getScrollMetrics(
  el: HTMLDivElement,
  cfg: AxisConfig,
): ScrollMetrics {
  const visible = el[cfg.clientSize];
  const total = el[cfg.scrollSize];
  const scroll = el[cfg.scrollPos];

  const max = Math.max(0, total - visible);
  const current = Math.min(scroll, max);

  return { current, max, visible, total };
}
