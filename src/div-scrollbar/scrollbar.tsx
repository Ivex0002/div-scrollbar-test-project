import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AdvancedStyle,
  Axis,
  PaddingArea,
  QuickStyle,
  StyleConfig,
  Thumb,
  Track,
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
  const paddingTrackRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
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

  // separated padding style apply track
  useEffect(() => {
    const paddingTrack = paddingTrackRef.current;
    if (!paddingTrack) return;

    paddingTrack.style.padding = currentPadding;

    return () => {};
  }, [isInteracting, paddingTrackRef, currentPadding]);

  // drag
  useEffect(() => {
    if (!isDragging) return;

    console.log("drag");

    const handleMove = (e: MouseEvent) => {
      const el = scrollAreaRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const delta = e[cfg.clientCoord] - dragInfoRef.current.startCoord;

      const DRAG_THRESHOLD = 3;

      if (Math.abs(delta) > DRAG_THRESHOLD) {
        dragInfoRef.current.didDrag = true;
      }

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
      didDrag: false,
    };
  };

  // track click thumb move
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!scrollArea || !track || !thumb) return;

    // console.log("track click thumb move");

    const handleTrackClick = createTrackClickHandler(
      scrollArea,
      track,
      thumb,
      axis,
      style,
      dragInfoRef,
    );

    track.addEventListener("click", handleTrackClick);

    return () => {
      track.removeEventListener("click", handleTrackClick);
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

  const {
    thumb: thumbStyle,
    track: trackStyle,
    paddingArea: paddingAreaStyle,
  } = mergedBaseStyle;
  const { thumb: thumbHoverStyle, paddingArea: trackHoverStyle } =
    mergedHoverstyle;

  return (
    // fixed track
    // 색상 제외 필요
    <div
      ref={trackRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        ...trackStyle,
      }}
    >
      {/* padding apply area */}
      <div
        ref={paddingTrackRef}
        // trackStyle 을 전용 스타일로 변경 필요 > 패딩, 색상
        style={{
          ...paddingAreaStyle,
          ...(isInteracting ? trackHoverStyle : null),
        }}
      />
      {/* thumb */}
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        style={{
          ...thumbStyle,
          ...(isInteracting ? thumbHoverStyle : null),
        }}
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
  // padding: number,
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

function createTrackClickHandler(
  scrollArea: HTMLDivElement,
  track: HTMLDivElement,
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
    if (!scrollArea || !track || !thumb) return;

    const rect = track.getBoundingClientRect();

    const clickPos = e[cfg.clientCoord] - (axis === "y" ? rect.top : rect.left);

    const visible = scrollArea[cfg.clientSize];
    const total = scrollArea[cfg.scrollSize];

    const trackSize = track[cfg.trackSize];

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
    thumb: "width",
    track: "width",
  },
  x: {
    thumb: "height",
    track: "height",
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

function getAxisStyle(
  axis: Axis,
  quickStyle: QuickStyle,
): Thumb & Track & PaddingArea {
  const { offset, thickness, borderRadius, color, padding } = quickStyle;
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
      backgroundColor: "transparent",
      transition: thickness.transition,
      ...pos.track,
    },
    paddingArea: {
      position: "absolute",
      inset: 0,
      backgroundColor: color.track,
      [dim.track]: thickness.track,
      padding: padding,
    },
  };
}

function getHoverStyle(
  axis: Axis,
  quickStyle: QuickStyle,
): Thumb & PaddingArea {
  const { thickness, color, paddingHover } = quickStyle;
  const dim = AXIS_DIMENSION[axis];

  return {
    thumb: {
      [dim.thumb]: thickness.thumbHover,
      backgroundColor: color.thumbHover,
    },
    paddingArea: {
      [dim.track]: thickness.trackHover,
      backgroundColor: color.trackHover,
      padding: paddingHover,
    },
  };
}

function mergeBaseStyle({
  axisStyle,
  advancedStyle,
}: {
  axisStyle: Thumb & Track & PaddingArea;
  advancedStyle?: Partial<AdvancedStyle>;
}): Thumb & Track & PaddingArea {
  return {
    thumb: {
      ...axisStyle.thumb,
      ...advancedStyle?.thumb,
    },
    track: {
      ...axisStyle.track,
      ...advancedStyle?.track,
    },
    paddingArea: {
      ...axisStyle.paddingArea,
    },
  };
}

function mergeHoverstyle({
  hoverStyle,
  advancedStyle,
}: {
  hoverStyle: Thumb & PaddingArea;
  advancedStyle?: Partial<AdvancedStyle>;
}): Thumb & PaddingArea {
  return {
    thumb: {
      ...hoverStyle.thumb,
      ...advancedStyle?.thumbHover,
    },
    paddingArea: {
      ...hoverStyle.paddingArea,
      ...advancedStyle?.trackHover,
    },
  };
}
