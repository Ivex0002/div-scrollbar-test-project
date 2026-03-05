export const AXIS_CONFIG = {
  y: {
    scrollPos: "scrollTop",
    scrollSize: "scrollHeight",
    clientSize: "clientHeight",
    clientCoord: "clientY",
    transform: (v: number) => `translateY(${v}px)`,
    sizeStyleProp: "height",
    sizeDomProp: "offsetHeight",
    trackSize: "clientHeight",
    orientation: "vertical" as const,
  },
  x: {
    scrollPos: "scrollLeft",
    scrollSize: "scrollWidth",
    clientSize: "clientWidth",
    clientCoord: "clientX",
    transform: (v: number) => `translateX(${v}px)`,
    sizeStyleProp: "width",
    sizeDomProp: "offsetWidth",
    trackSize: "clientWidth",
    orientation: "horizontal" as const,
  },
} as const;

export const AXIS_DIMENSION = {
  y: {
    thickness: "width",
    align: "justifyContent",
    crossPos: "top",
    transform: "translateY(-50%)",
  },
  x: {
    thickness: "height",
    align: "alignItems",
    crossPos: "left",
    transform: "translateX(-50%)",
  },
} as const;

export const AXIS_POSITION = {
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
