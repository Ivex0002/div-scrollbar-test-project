import type { Axis } from "../../type";
import { AXIS_CONFIG } from "../constants";

export function createScrollHandler(
  axis: Axis,
  rafId: React.RefObject<number | null>,
  scrollArea: HTMLDivElement,
  thumb: HTMLDivElement,
  layout: HTMLDivElement,
  minimumSize: number,
) {
  const cfg = AXIS_CONFIG[axis];

  return () => {
    if (rafId.current !== null) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;

      const visible = scrollArea[cfg.clientSize];
      const total = scrollArea[cfg.scrollSize];
      const scroll = scrollArea[cfg.scrollPos];

      if (total <= visible) {
        layout.style.display = "none";
        thumb.style.display = "none";
        return;
      }

      thumb.style.display = "block";

      const layoutSize = layout[cfg.trackSize];
      const thumbSize = Math.max((visible / total) * layoutSize, minimumSize);

      const thumbPos = (scroll / (total - visible)) * (layoutSize - thumbSize);

      thumb.style[cfg.sizeProp] = `${thumbSize}px`;
      thumb.style.transform = cfg.transform(thumbPos);
    });
  };
}
