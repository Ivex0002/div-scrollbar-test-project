import type { ScrollDirection } from "./type";

export const CONTAINER_STYLE: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
};

const BASE_SCROLL_AREA_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

export function getScrollAreaStyle(
  direction: ScrollDirection,
): React.CSSProperties {
  return {
    ...BASE_SCROLL_AREA_STYLE,
    ...(direction === "y" && { overflowY: "auto" }),
    ...(direction === "x" && { overflowX: "auto" }),
    ...(direction === "auto" && { overflowX: "auto", overflowY: "auto" }),
  };
}
