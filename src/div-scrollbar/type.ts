import type { CSSProperties } from "react";

export type Axis = "x" | "y";

export type ScrollDirection = "x" | "y" | "auto";

export type QuickStyle = {
  offsetPx: number;
  offsetHoverPx: number;
  paddingPx: number;
  paddingHoverPx: number;
  minimumSizePx: number;

  thickness: {
    thumb: string;
    thumbHover: string;
    track: string;
    trackHover: string;
    transition: string;
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

export type thumbAndTrack = { thumb: CSSProperties; track: CSSProperties };
