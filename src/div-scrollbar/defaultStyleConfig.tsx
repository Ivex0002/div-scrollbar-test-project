import type { AdvancedCSSProperties, StyleConfig } from "./type";

const BASE_TRACK_STYLE: AdvancedCSSProperties = {
  position: "absolute",
  borderRadius: "9999px",
  // display: "flex",
};

const BASE_THUMB_STYLE: AdvancedCSSProperties = {
  borderRadius: "9999px",
  willChange: "transform",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
};

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  quickStyle: {
    offset: "6px",
    minimumSizePx: 20,

    thickness: {
      thumb: "6px",
      thumbHover: "8px",
      track: "6px",
      trackHover: "8px",
      transition: "0.15px",
    },

    borderRadius: "9999px",

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
