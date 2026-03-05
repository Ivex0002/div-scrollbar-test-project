import type { Axis, UserStyleConfig } from "../../../types";
import { DEFAULT_STYLE_CONFIG } from "./defaultStyleConfig";
import { getAxisStyle, getHoverStyle } from "./getStyles";
import {
  mergeBaseStyle,
  mergeHoverstyle,
  mergeStyleConfig,
} from "./mergeStyles";

export function resolveScrollbarStyles({
  axis,
  customStyle,
  isInteracting,
}: {
  axis: Axis;
  customStyle: UserStyleConfig;
  isInteracting: boolean;
}) {
  const style = mergeStyleConfig(DEFAULT_STYLE_CONFIG, customStyle);

  const axisStyle = getAxisStyle(axis, style.quickStyle);
  const hoverStyle = getHoverStyle(axis, style.quickStyle);

  const mergedBaseStyle = mergeBaseStyle({
    axisStyle,
    advancedStyle: style.advancedStyle,
  });

  const mergedHoverStyle = mergeHoverstyle({
    hoverStyle,
    advancedStyle: style.advancedStyle,
  });

  return {
    layoutStyle: axisStyle.layout,
    trackStyle: isInteracting
      ? { ...mergedBaseStyle.track, ...mergedHoverStyle.track }
      : mergedBaseStyle.track,
    thumbStyle: isInteracting
      ? { ...mergedBaseStyle.thumb, ...mergedHoverStyle.thumb }
      : mergedBaseStyle.thumb,
    quickStyle: style.quickStyle,
  };
}
