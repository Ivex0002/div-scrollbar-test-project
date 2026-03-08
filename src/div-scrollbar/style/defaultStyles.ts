import type { CSSProperties } from "react";
import type { ScrollDirection, StyleConfig } from "../type";

export const CONTAINER_STYLE: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
};

const BASE_SCROLL_AREA_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

export function getScrollAreaStyle(direction: ScrollDirection): CSSProperties {
  return {
    ...BASE_SCROLL_AREA_STYLE,
    ...(direction === "y" && { overflowX: "hidden", overflowY: "auto" }),
    ...(direction === "x" && { overflowX: "auto", overflowY: "hidden" }),
    ...(direction === "auto" && { overflowX: "auto", overflowY: "auto" }),
  };
}

export const BASE_LAYOUT_STYLE: CSSProperties = {
  position: "absolute",
  willChange: "transform",
  cursor: "pointer",
  display: "flex",
};

export const BASE_TRACK_STYLE: CSSProperties = {
  position: "absolute",
  display: "flex",
};

export const BASE_THUMB_STYLE: CSSProperties = {
  position: "absolute",
};

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  layout: {
    offset: "12px",
    padding: { default: "0", hover: "0" },
    minimumSizePx: 20,
    borderRadius: "9999px",
  },

  transition: {
    duration: "0.15s",
    timingFunction: "ease",
    properties: ["backgroundColor", "padding", "width", "height", "opacity"],
  },

  thickness: {
    thumb: { default: "6px", hover: "6px" },
    track: { default: "6px", hover: "6px" },
  },

  color: {
    thumb: { default: "#00000044", hover: "#00000066" },
    track: { default: "#00000010", hover: "#00000010" },
  },

  border: {
    thumb: { default: "", hover: "" },
    track: { default: "", hover: "" },
  },
  shadow: {
    thumb: { default: "", hover: "" },
    track: { default: "", hover: "" },
  },
};
