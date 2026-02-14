import { useEffect, useMemo, useRef, useState } from "react";
import type { Axis, UserStyleConfig } from "../type";
import { BASE_LAYOUT_STYLE, DEFAULT_STYLE_CONFIG } from "../defaultStyleConfig";
import {
  mergeBaseStyle,
  mergeHoverstyle,
  mergeStyleConfig,
} from "./mergeStyles";
import { AXIS_CONFIG } from "./constants";
import { createScrollHandler } from "./handlers/createScrollHandler";
import { calcDragScroll } from "./handlers/calcDragScroll";
import { createTrackClickHandler } from "./handlers/createTrackClickHandler";
import { getAxisStyle, getHoverStyle } from "./getStyles";

type ScrollbarProps = {
  axis: Axis;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  customStyle?: UserStyleConfig;
};

export function Scrollbar({
  axis,
  scrollAreaRef,
  customStyle = {},
}: ScrollbarProps) {
  const TrackRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({
    startCoord: 0,
    startScroll: 0,
    didDrag: false,
  });

  const isInteracting = isHover || isDragging;

  /**
   * merged style object
   */
  const style = useMemo(
    () => mergeStyleConfig(DEFAULT_STYLE_CONFIG, customStyle),
    [customStyle],
  );

  const currentPadding = useMemo(
    () =>
      isInteracting ? style.quickStyle.paddingHover : style.quickStyle.padding,
    [isInteracting, style.quickStyle.padding, style.quickStyle.paddingHover],
  );

  /**
   * const styles for axis
   */
  const cfg = AXIS_CONFIG[axis];

  // scroll
  useEffect(() => {
    const el = scrollAreaRef.current;
    const thumb = thumbRef.current;
    const layout = layoutRef.current;
    if (!el || !thumb || !layout) return;

    const onScroll = createScrollHandler(
      axis,
      rafId,
      el,
      thumb,
      layout,
      style.quickStyle.minimumSizePx,
    );

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(onScroll);
    ro.observe(el);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [axis, scrollAreaRef, style.quickStyle.minimumSizePx]);

  // separated padding style apply track
  useEffect(() => {
    const track = TrackRef.current;
    if (!track) return;

    track.style.padding = currentPadding;

    return () => {};
  }, [isInteracting, TrackRef, currentPadding]);

  // drag
  useEffect(() => {
    if (!isDragging) return;

    console.log("drag");

    const handleMove = (e: MouseEvent) => {
      const el = scrollAreaRef.current;
      const layout = layoutRef.current;
      if (!el || !layout) return;

      const delta = e[cfg.clientCoord] - dragInfoRef.current.startCoord;

      const DRAG_THRESHOLD = 3;

      if (Math.abs(delta) > DRAG_THRESHOLD) {
        dragInfoRef.current.didDrag = true;
      }

      const visible = el[cfg.clientSize];
      const total = el[cfg.scrollSize];
      const trackSize = layout[cfg.trackSize];

      const thumbSize = Math.max(
        (visible / total) * trackSize,
        style.quickStyle.minimumSizePx,
      );

      el[cfg.scrollPos] = calcDragScroll({
        delta,
        startScroll: dragInfoRef.current.startScroll,
        visible,
        total,
        trackSize,
        thumbSize,
      });
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, axis, scrollAreaRef, style.quickStyle.minimumSizePx]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollAreaRef.current;
    if (!el) return;

    e.preventDefault();
    setIsDragging(true);

    dragInfoRef.current = {
      startCoord: e[cfg.clientCoord],
      startScroll: el[cfg.scrollPos],
      didDrag: false,
    };
  };

  // track click thumb move
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const layout = layoutRef.current;
    const thumb = thumbRef.current;
    if (!scrollArea || !layout || !thumb) return;

    // console.log("track click thumb move");

    const handleTrackClick = createTrackClickHandler(
      scrollArea,
      layout,
      thumb,
      axis,
      style,
      dragInfoRef,
    );

    layout.addEventListener("click", handleTrackClick);

    return () => {
      layout.removeEventListener("click", handleTrackClick);
    };
  }, [scrollAreaRef, axis, style]);

  // apply styles
  const axisStyle = useMemo(
    () => getAxisStyle(axis, style.quickStyle),
    [axis, style.quickStyle],
  );

  const hoverStyle = useMemo(
    () => getHoverStyle(axis, style.quickStyle),
    [axis, style.quickStyle],
  );

  const mergedBaseStyle = useMemo(
    () =>
      mergeBaseStyle({
        axisStyle: axisStyle,
        advancedStyle: style.advancedStyle,
      }),
    [axisStyle, style.advancedStyle],
  );

  const mergedHoverstyle = useMemo(
    () =>
      mergeHoverstyle({
        hoverStyle: hoverStyle,
        advancedStyle: style.advancedStyle,
      }),
    [hoverStyle, style.advancedStyle],
  );

  const { thumb: thumbStyle, track: trackStyle } = mergedBaseStyle;
  const { thumb: thumbHoverStyle, track: trackHoverStyle } = mergedHoverstyle;

  return (
    <div
      className="layout"
      ref={layoutRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ ...BASE_LAYOUT_STYLE, ...axisStyle.layout }}
    >
      <div
        className="track"
        ref={TrackRef}
        style={{
          ...trackStyle,
          ...(isInteracting ? trackHoverStyle : null),
        }}
      >
        <div
          ref={thumbRef}
          onMouseDown={handleMouseDown}
          style={{
            ...thumbStyle,
            ...(isInteracting ? thumbHoverStyle : null),
          }}
        />
      </div>
    </div>
  );
}
