import type { CSSProperties } from "react";

export type Axis = "x" | "y";

export type ScrollDirection = "x" | "y" | "auto";

export type QuickStyle = {
  offset: string;
  padding: string;
  paddingHover: string;
  minimumSizePx: number;
  transition: string;

  thickness: {
    thumb: string;
    thumbHover: string;
    track: string;
    trackHover: string;
  };

  borderRadius: string;

  color: {
    thumb: string;
    thumbHover: string;
    track: string;
    trackHover: string;
  };
};

export type AdvancedCSSProperties = Omit<CSSProperties, "width" | "height">;

export type StylePatch = Partial<AdvancedCSSProperties>;

export type AdvancedStyle = {
  thumb: AdvancedCSSProperties;
  thumbHover: AdvancedCSSProperties;
  track: AdvancedCSSProperties;
  trackHover: AdvancedCSSProperties;
};

export type StyleConfig = {
  quickStyle: QuickStyle;
  advancedStyle: AdvancedStyle;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type UserStyleConfig = DeepPartial<StyleConfig>;

export type Thumb = { thumb: CSSProperties };
export type Track = { track: CSSProperties };
export type Layout = { layout: CSSProperties };
