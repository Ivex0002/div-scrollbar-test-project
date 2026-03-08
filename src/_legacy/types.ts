import type { CSSProperties } from "react";
import type { AXIS_CONFIG } from "./scrollbar/constants";

export type Axis = "x" | "y";
export type ScrollDirection = "x" | "y" | "auto";

export type AxisConfig = (typeof AXIS_CONFIG)[Axis];
export type ScrollMetrics = {
  current: number;
  max: number;
  visible: number;
  total: number;
};

export type AnimatableCSSProperty = keyof React.CSSProperties;

export type Transition = {
  duration: string;
  timingFunction: string;
  properties: AnimatableCSSProperty[];
};

export type QuickStyle = {
  offset: string;
  padding: string;
  paddingHover: string;
  minimumSizePx: number;
  transition: Transition;
  borderRadius: string;

  thickness: {
    thumb: string;
    thumbHover: string;
    track: string;
    trackHover: string;
  };

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

export type ScrollState = { current: number; max: number };
