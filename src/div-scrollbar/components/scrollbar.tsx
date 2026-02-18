import { useEffect, useMemo, useRef, useState } from "react";
import type { Axis, UserStyleConfig } from "../types";
import { BASE_LAYOUT_STYLE, DEFAULT_STYLE_CONFIG } from "../defaultStyleConfig";
import {
  mergeBaseStyle,
  mergeHoverstyle,
  mergeStyleConfig,
} from "./mergeStyles";
import {
  AXIS_CONFIG,
  //  DRAG_THRESHOLD
} from "../scrollbar/constants";
// import { calcDragScroll } from "./handlers/calcDragScroll";
import { createTrackClickHandler } from "../scrollbar/events/createTrackClickHandler";
import { getAxisStyle, getHoverStyle } from "./getStyles";
import { updateThumb } from "../scrollbar/view/renderer/updateThumb";
import { getScrollMetrics } from "../scrollbar/logic/getScrollMetrics";

type ScrollbarProps = {
  axis: Axis;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  scrollAreaId: string;
  customStyle?: UserStyleConfig;
};

export function Scrollbar({
  axis,
  scrollAreaRef,
  scrollAreaId,
  customStyle = {},
}: ScrollbarProps) {
  const TrackRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);
  const scrollStateRef = useRef({ current: 0, max: 0 });
  // const [scrollState, setScrollState] = useState({
  //   current: 0,
  //   max: 0,
  // });
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
  // useEffect(() => {
  //   const el = scrollAreaRef.current;
  //   const layout = layoutRef.current;
  //   const thumb = thumbRef.current;

  //   let frame: number | null = null;

  //   if (!el || !thumb || !layout) return;

  //   const scheduleScrollbarSync = () => {
  //     if (frame) return;

  //     frame = requestAnimationFrame(() => {
  //       frame = null;

  //       // (cfg, setScrollState)
  //       const visible = el[cfg.clientSize];
  //       const total = el[cfg.scrollSize];
  //       const scroll = el[cfg.scrollPos];

  //       const max = Math.max(0, total - visible);
  //       const current = Math.min(scroll, max);

  //       setScrollState({
  //         current: Math.round(current),
  //         max: Math.round(max),
  //       });

  //       if (total <= visible) {
  //         layout.style.display = "none";
  //         thumb.style.display = "none";
  //         return;
  //       }

  //       thumb.style.display = "block";

  //       const layoutSize = layout[cfg.trackSize];
  //       const thumbSize = Math.max(
  //         (visible / total) * layoutSize,
  //         style.quickStyle.minimumSizePx,
  //       );

  //       const thumbPos = (current / max) * (layoutSize - thumbSize);

  //       thumb.style[cfg.sizeProp] = `${thumbSize}px`;
  //       thumb.style.transform = cfg.transform(thumbPos);
  //     });
  //   };

  //   el.addEventListener("scroll", scheduleScrollbarSync);
  //   const ro = new ResizeObserver(scheduleScrollbarSync);
  //   ro.observe(el);

  //   return () => {
  //     el.removeEventListener("scroll", scheduleScrollbarSync);
  //     ro.disconnect();
  //     if (frame) cancelAnimationFrame(frame);
  //   };
  // }, [scrollAreaRef, cfg, style.quickStyle.minimumSizePx]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    const layout = layoutRef.current;
    const thumb = thumbRef.current;

    if (!el || !layout || !thumb) return;

    const handleScroll = () => {
      const metrics = getScrollMetrics(el, cfg);

      scrollStateRef.current = {
        current: metrics.current,
        max: metrics.max,
      };

      updateThumb(layout, thumb, cfg, style.quickStyle.minimumSizePx, metrics);
    };

    el.addEventListener("scroll", handleScroll);

    const ro = new ResizeObserver(handleScroll);
    ro.observe(el);

    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, [axis, scrollAreaRef, cfg, style.quickStyle.minimumSizePx]);

  // // scroll : wheel
  // useEffect(() => {
  //   const el = scrollAreaRef.current;
  //   const layout = layoutRef.current;
  //   if (!el || !layout) return;

  //   let wheelDelta = 0;
  //   let frame: number | null = null;

  //   const schedule = () => {
  //     if (frame) return;

  //     frame = requestAnimationFrame(() => {
  //       frame = null;

  //       el[cfg.scrollPos] += wheelDelta;
  //       wheelDelta = 0;
  //     });
  //   };

  //   const handleWheel = (e: WheelEvent) => {
  //     const deltaY = normalizeDelta(e);
  //     wheelDelta += deltaY;
  //     schedule();
  //   };
  //   const normalizeDelta = (e: WheelEvent) => {
  //     if (e.deltaMode === 1) return e.deltaY * 16;
  //     if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  //     return e.deltaY;
  //   };

  //   layout.addEventListener("wheel", handleWheel, { passive: false });

  //   return () => {
  //     layout.removeEventListener("wheel", handleWheel);
  //   };
  // }, [scrollAreaRef, cfg]);

  // useEffect(() => {
  //   const track = TrackRef.current;
  //   const thumb = thumbRef.current;
  //   const el = scrollAreaRef.current;

  //   if (!track || !thumb || !el) return;

  //   const handleWheel = (e: WheelEvent) => {
  //     el.scrollBy({
  //       top: axis === "y" ? e.deltaY : 0,
  //       left: axis === "x" ? e.deltaY : 0,
  //       behavior: "smooth",
  //     });
  //   };

  //   track.addEventListener("wheel", handleWheel, { passive: true });
  //   thumb.addEventListener("wheel", handleWheel, { passive: true });

  //   return () => {
  //     track.removeEventListener("wheel", handleWheel);
  //     thumb.removeEventListener("wheel", handleWheel);
  //   };
  // }, [axis, scrollAreaRef]);

  // smooth wheel scroll with momentum
  // useEffect(() => {
  //   const track = TrackRef.current;
  //   const thumb = thumbRef.current;
  //   const el = scrollAreaRef.current;

  //   if (!track || !thumb || !el) return;

  //   let targetScroll = el[cfg.scrollPos];
  //   let frame: number | null = null;

  //   const animate = () => {
  //     const current = el[cfg.scrollPos];
  //     const delta = targetScroll - current;

  //     if (Math.abs(delta) > 0.5) {
  //       el[cfg.scrollPos] = current + delta * 0.15;
  //       frame = requestAnimationFrame(animate);
  //     } else {
  //       el[cfg.scrollPos] = targetScroll;
  //       frame = null;
  //     }
  //   };
  //   const handleWheel = (e: WheelEvent) => {
  //     e.preventDefault();

  //     let delta = e.deltaY;
  //     if (e.deltaMode === 1) delta *= 16;
  //     if (e.deltaMode === 2) delta *= window.innerHeight;

  //     targetScroll = Math.max(
  //       0,
  //       Math.min(el[cfg.scrollSize] - el[cfg.clientSize], targetScroll + delta),
  //     );

  //     if (!frame) {
  //       frame = requestAnimationFrame(animate);
  //     }
  //   };

  //   track.addEventListener("wheel", handleWheel, { passive: false });
  //   thumb.addEventListener("wheel", handleWheel, { passive: false });

  //   return () => {
  //     track.removeEventListener("wheel", handleWheel);
  //     thumb.removeEventListener("wheel", handleWheel);
  //     if (frame) cancelAnimationFrame(frame);
  //   };
  // }, [axis, scrollAreaRef, cfg]);

  /**
   * separated padding style apply track
   */
  useEffect(() => {
    const track = TrackRef.current;
    if (!track) return;

    track.style.padding = currentPadding;
  }, [isInteracting, TrackRef, currentPadding]);

  // /**
  //  * drag
  //  */
  // useEffect(() => {
  //   if (!isDragging) return;

  //   const handleMove = (e: MouseEvent) => {
  //     const el = scrollAreaRef.current;
  //     const layout = layoutRef.current;
  //     if (!el || !layout) return;

  //     const delta = e[cfg.clientCoord] - dragInfoRef.current.startCoord;

  //     if (Math.abs(delta) > DRAG_THRESHOLD) {
  //       dragInfoRef.current.didDrag = true;
  //     }

  //     const visible = el[cfg.clientSize];
  //     const total = el[cfg.scrollSize];
  //     const trackSize = layout[cfg.trackSize];

  //     const thumbSize = Math.max(
  //       (visible / total) * trackSize,
  //       style.quickStyle.minimumSizePx,
  //     );

  //     el[cfg.scrollPos] = calcDragScroll({
  //       delta,
  //       startScroll: dragInfoRef.current.startScroll,
  //       visible,
  //       total,
  //       trackSize,
  //       thumbSize,
  //     });
  //   };

  //   const handleUp = () => setIsDragging(false);

  //   window.addEventListener("mousemove", handleMove);
  //   window.addEventListener("mouseup", handleUp);

  //   return () => {
  //     window.removeEventListener("mousemove", handleMove);
  //     window.removeEventListener("mouseup", handleUp);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isDragging, axis, scrollAreaRef, style.quickStyle.minimumSizePx]);

  /**
   * drag
   */
  useEffect(() => {
    const el = scrollAreaRef.current;
    const layout = layoutRef.current;
    const thumb = thumbRef.current;

    if (!el || !layout || !thumb) return;

    let startCoord = 0;
    let startScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e[cfg.clientCoord] - startCoord;

      const metrics = getScrollMetrics(el, cfg);

      const layoutSize = layout[cfg.trackSize];

      const thumbSize = Math.max(
        (metrics.visible / metrics.total) * layoutSize,
        20,
      );

      const scrollRatio = delta / (layoutSize - thumbSize);

      el[cfg.scrollPos] = startScroll + scrollRatio * metrics.max;
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();

      startCoord = e[cfg.clientCoord];
      startScroll = el[cfg.scrollPos];

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    thumb.addEventListener("mousedown", handleMouseDown);

    return () => {
      thumb.removeEventListener("mousedown", handleMouseDown);
    };
  }, [axis, scrollAreaRef, cfg]);

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
          role="scrollbar"
          tabIndex={0}
          aria-orientation={cfg.orientation}
          aria-controls={scrollAreaId}
          aria-valuemin={0}
          aria-valuemax={scrollStateRef.current.max}
          aria-valuenow={scrollStateRef.current.current}
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
