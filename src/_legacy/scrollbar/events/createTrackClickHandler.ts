import type { Axis, StyleConfig } from "../../types";
import { AXIS_CONFIG } from "../constants";

export function createTrackClickHandler(
  scrollArea: HTMLDivElement,
  layout: HTMLDivElement,
  thumb: HTMLDivElement,
  axis: Axis,
  style: StyleConfig,
  dragInfoRef: React.RefObject<{
    startCoord: number;
    startScroll: number;
    didDrag: boolean;
  }>,
) {
  return (e: MouseEvent) => {
    if (dragInfoRef.current.didDrag) {
      dragInfoRef.current.didDrag = false;
      return;
    }
    const cfg = AXIS_CONFIG[axis];

    console.log("createTrackClickHandler");
    if (!scrollArea || !layout || !thumb) return;

    const rect = layout.getBoundingClientRect();

    const clickPos = e[cfg.clientCoord] - (axis === "y" ? rect.top : rect.left);

    const visible = scrollArea[cfg.clientSize];
    const total = scrollArea[cfg.scrollSize];

    const trackSize = layout[cfg.trackSize];

    const thumbSize = Math.max(
      (visible / total) * trackSize,
      style.quickStyle.minimumSizePx,
    );

    const maxThumbMove = trackSize - thumbSize;
    const halfTrack = trackSize / 2;

    const thumbPos = clickPos < halfTrack ? clickPos : clickPos - thumbSize;

    const clampedThumbPos = Math.max(0, Math.min(thumbPos, maxThumbMove));

    const scrollRatio = (total - visible) / maxThumbMove;

    scrollArea[cfg.scrollPos] = clampedThumbPos * scrollRatio;
  };
}
