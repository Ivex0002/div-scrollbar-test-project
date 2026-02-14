export const AXIS_CONFIG = {
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

export const AXIS_DIMENSION = {
  y: {
    thickness: "width",
  },
  x: {
    thickness: "height",
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
