import type { AxisConfig, ScrollMetrics } from "../../type";

export function updateThumb(
  layout: HTMLDivElement,
  thumb: HTMLDivElement,
  cfg: AxisConfig,
  minimumSizePx: number,
  metrics: ScrollMetrics,
) {
  const { current, max, visible, total } = metrics;

  if (total <= visible) {
    layout.style.display = "none";
    thumb.style.display = "none";
    return;
  }

  thumb.style.display = "block";

  const layoutSize = layout[cfg.trackSize];

  const thumbSize = Math.max((visible / total) * layoutSize, minimumSizePx);

  const thumbPos = max === 0 ? 0 : (current / max) * (layoutSize - thumbSize);

  thumb.style[cfg.sizeProp] = `${thumbSize}px`;
  thumb.style.transform = cfg.transform(thumbPos);
}
