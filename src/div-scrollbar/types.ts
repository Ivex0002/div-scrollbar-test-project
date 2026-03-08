import type { CSSProperties } from "react";
import type { AXIS_CONFIG } from "./style/constants";

export type Axis = "x" | "y";
export type ScrollDirection = "x" | "y" | "auto";

export type AxisConfig = (typeof AXIS_CONFIG)[Axis];

type CSSProperty = keyof CSSProperties;

export type Transition = {
  duration: string;
  timingFunction: string;
  properties: CSSProperty[];
};

type HoverState<T> = {
  default: T;
  hover: T;
};

type ElementStyles<T> = {
  thumb: HoverState<T>;
  track: HoverState<T>;
};

export type StyleConfig = {
  layout: {
    offset: string;
    padding: HoverState<string>;
    minimumSizePx: number;
    borderRadius: string;
  };

  transition: Transition;

  thickness: ElementStyles<string>;
  color: ElementStyles<string>;
  border: ElementStyles<string>;
  shadow: ElementStyles<string>;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

export type UserStyleConfig = DeepPartial<StyleConfig>;
