import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AdvancedStyle,
  Axis,
  Layout,
  QuickStyle,
  StyleConfig,
  Thumb,
  Track,
  UserStyleConfig,
} from "../type";
import { mergeStyleConfig } from "../util";
import { BASE_LAYOUT_STYLE, DEFAULT_STYLE_CONFIG } from "../defaultStyleConfig";

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

function createScrollHandler(
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

function createTrackClickHandler(
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
    thickness: "width",
  },
  x: {
    thickness: "height",
  },
} as const;

const AXIS_POSITION = {
  y: (offset: string) => ({
    layout: {
      right: "12px",
      top: offset,
      bottom: offset,
    },
  }),
  x: (offset: string) => ({
    layout: {
      bottom: "12px",
      left: offset,
      right: offset,
    },
  }),
} as const;

function getAxisStyle(
  axis: Axis,
  quickStyle: QuickStyle,
): Thumb & Track & Layout {
  const { offset, thickness, borderRadius, color, padding, transition } =
    quickStyle;
  const dim = AXIS_DIMENSION[axis];
  const pos = AXIS_POSITION[axis](offset);

  return {
    thumb: {
      [dim.thickness]: thickness.thumb,
      borderRadius: borderRadius,
      backgroundColor: color.thumb,
      transition: transition,
    },
    track: {
      width: "100%",
      height: "100%",
      borderRadius: borderRadius,
      backgroundColor: color.track,
      padding: padding,
      transition: transition,
    },
    layout: { [dim.thickness]: thickness.track, ...pos.layout },
  };
}

function getHoverStyle(axis: Axis, quickStyle: QuickStyle): Thumb & Track {
  const { thickness, color, paddingHover } = quickStyle;
  const dim = AXIS_DIMENSION[axis];

  return {
    thumb: {
      [dim.thickness]: thickness.thumbHover,
      backgroundColor: color.thumbHover,
    },
    track: {
      [dim.thickness]: thickness.trackHover,
      backgroundColor: color.trackHover,
      padding: paddingHover,
    },
  };
}

function mergeBaseStyle({
  axisStyle,
  advancedStyle,
}: {
  axisStyle: Thumb & Track;
  advancedStyle?: Partial<AdvancedStyle>;
}): Thumb & Track {
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
  hoverStyle: Thumb & Track;
  advancedStyle?: Partial<AdvancedStyle>;
}): Thumb & Track {
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
