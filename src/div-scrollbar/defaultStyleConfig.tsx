import type { CSSProperties } from "react";
import type { AdvancedCSSProperties, StyleConfig } from "./type";

export const BASE_LAYOUT_STYLE: CSSProperties = {
  position: "absolute",
  willChange: "transform",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
};

const BASE_TRACK_STYLE: AdvancedCSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  justifyContent: "center",
};

const BASE_THUMB_STYLE: AdvancedCSSProperties = {
  position: "absolute",
};

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  quickStyle: {
    offset: "12px",
    padding: "0",
    paddingHover: "6px",
    minimumSizePx: 20,
    transition: {
      duration: "0.15s",
      timingFunction: "ease",
      properties: ["backgroundColor", "padding", "width", "height"],
    },

    borderRadius: "9999px",

    thickness: {
      thumb: "6px",
      thumbHover: "6px",
      track: "6px",
      trackHover: "6px",
    },

    color: {
      thumb: "#00000044",
      thumbHover: "#00000066",
      track: "#00000010",
      trackHover: "#00000010",
    },
  },

  advancedStyle: {
    thumb: { ...BASE_THUMB_STYLE },
    thumbHover: {},
    track: { ...BASE_TRACK_STYLE },
    trackHover: {},
  },
};
