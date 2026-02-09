import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AdvancedStyle,
  Axis,
  QuickStyle,
  thumbAndTrack as ThumbAndTrack,
  UserStyleConfig,
} from "./type";
import { mergeStyleConfig } from "./util";
import { DEFAULT_STYLE_CONFIG } from "./defaultStyleConfig";

const AXIS_CONFIG = {
  y: {
    scrollPos: "scrollTop",
    scrollSize: "scrollHeight",
    clientSize: "clientHeight",
    clientCoord: "clientY",
    transform: (v: number) => `translateY(${v}px)`,
    sizeProp: "height",
    trackSize: "clientHeight",
  },
  x: {
    scrollPos: "scrollLeft",
    scrollSize: "scrollWidth",
    clientSize: "clientWidth",
    clientCoord: "clientX",
    transform: (v: number) => `translateX(${v}px)`,
    sizeProp: "width",
    trackSize: "clientWidth",
  },
} as const;

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
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({
    startCoord: 0,
    startScroll: 0,
  });

  /**
   * merged style object
   */
  const style = useMemo(
    () => mergeStyleConfig(DEFAULT_STYLE_CONFIG, customStyle),
    [customStyle],
  );

  /**
   * const styles for axis
   */
  const cfg = AXIS_CONFIG[axis];

  // scroll
  useEffect(() => {
    const el = scrollAreaRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!el || !thumb || !track) return;

    const onScroll = createScrollHandler(
      axis,
      rafId,
      el,
      thumb,
      track,
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

  // drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const el = scrollAreaRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const delta = e[cfg.clientCoord] - dragInfoRef.current.startCoord;

      const visible = el[cfg.clientSize];
      const total = el[cfg.scrollSize];
      const trackSize = track[cfg.trackSize];

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
    };
  };

  // apply styles
  const isInteracting = isHover || isDragging;

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
      ref={trackRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ ...trackStyle, ...(isInteracting ? trackHoverStyle : null) }}
    >
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        style={{ ...thumbStyle, ...(isInteracting ? thumbHoverStyle : null) }}
      />
    </div>
  );
}

function createScrollHandler(
  axis: Axis,
  rafId: React.RefObject<number | null>,
  scrollArea: HTMLDivElement,
  thumb: HTMLDivElement,
  track: HTMLDivElement,
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
        track.style.display = "none";
        thumb.style.display = "none";
        return;
      }

      thumb.style.display = "block";

      const trackSize = track[cfg.trackSize];
      const thumbSize = Math.max((visible / total) * trackSize, minimumSize);

      const thumbPos = (scroll / (total - visible)) * (trackSize - thumbSize);

      thumb.style[cfg.sizeProp] = `${thumbSize}px`;
      thumb.style.transform = cfg.transform(thumbPos);
    });
  };
}

function calcDragScroll({
  delta,
  startScroll,
  visible,
  total,
  trackSize,
  thumbSize,
}: {
  delta: number;
  startScroll: number;
  visible: number;
  total: number;
  trackSize: number;
  thumbSize: number;
}) {
  const scrollRatio = (total - visible) / (trackSize - thumbSize);
  return startScroll + delta * scrollRatio;
}

const AXIS_DIMENSION = {
  y: {
    thumb: "width",
    track: "width",
    align: "alignItems",
  },
  x: {
    thumb: "height",
    track: "height",
    align: "justifyContent",
  },
} as const;

const AXIS_POSITION = {
  y: (offset: string) => ({
    track: {
      right: "4px",
      top: offset,
      bottom: offset,
    },
  }),
  x: (offset: string) => ({
    track: {
      bottom: "4px",
      left: offset,
      right: offset,
    },
  }),
} as const;

function getAxisStyle(axis: Axis, quickStyle: QuickStyle): ThumbAndTrack {
  const { offset, thickness, borderRadius, color } = quickStyle;
  const dim = AXIS_DIMENSION[axis];
  const pos = AXIS_POSITION[axis](offset);

  return {
    thumb: {
      [dim.thumb]: thickness.thumb,
      borderRadius: borderRadius,
      backgroundColor: color.thumb,
      transition: thickness.transition,
    },
    track: {
      [dim.track]: thickness.track,
      [dim.align]: "center",
      backgroundColor: color.track,
      transition: thickness.transition,
      ...pos.track,
    },
  };
}

function getHoverStyle(axis: Axis, quickStyle: QuickStyle): ThumbAndTrack {
  const { thickness, color } = quickStyle;
  const dim = AXIS_DIMENSION[axis];

  return {
    thumb: {
      [dim.thumb]: thickness.thumbHover,
      backgroundColor: color.thumbHover,
    },
    track: {
      [dim.track]: thickness.trackHover,
      backgroundColor: color.trackHover,
    },
  };
}

function mergeBaseStyle({
  axisStyle,
  advancedStyle,
}: {
  axisStyle: ThumbAndTrack;
  advancedStyle?: Partial<AdvancedStyle>;
}): ThumbAndTrack {
  return {
    thumb: {
      ...axisStyle.thumb,
      ...advancedStyle?.thumb,
    },
    track: {
      ...axisStyle.track,
      ...advancedStyle?.track,
    },
  };
}

function mergeHoverstyle({
  hoverStyle,
  advancedStyle,
}: {
  hoverStyle: ThumbAndTrack;
  advancedStyle?: Partial<AdvancedStyle>;
}): ThumbAndTrack {
  return {
    thumb: {
      ...hoverStyle.thumb,
      ...advancedStyle?.thumbHover,
    },
    track: {
      ...hoverStyle.track,
      ...advancedStyle?.trackHover,
    },
  };
}
