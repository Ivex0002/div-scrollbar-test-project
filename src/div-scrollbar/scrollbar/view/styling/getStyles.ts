import type {
  Axis,
  Layout,
  QuickStyle,
  Thumb,
  Track,
  Transition,
} from "../../../types";
import { AXIS_DIMENSION, AXIS_POSITION } from "../../constants";
import { BASE_LAYOUT_STYLE } from "./defaultStyleConfig";

function getTransition(transition: Transition): string {
  const { duration, timingFunction, properties } = transition;
  return properties
    .map((el) => `${el} ${duration} ${timingFunction}`)
    .join(", ");
}

export function getAxisStyle(
  axis: Axis,
  quickStyle: QuickStyle,
): Thumb & Track & Layout {
  const { offset, thickness, borderRadius, color, padding, transition } =
    quickStyle;
  const dim = AXIS_DIMENSION[axis];
  const pos = AXIS_POSITION[axis](offset);
  const formattedTransition = getTransition(transition);

  return {
    layout: {
      ...BASE_LAYOUT_STYLE,
      [dim.thickness]: thickness.track,
      [dim.align]: "center",
      ...pos.layout,
    },
    track: {
      width: "100%",
      height: "100%",
      transform: dim.transform,
      [dim.crossPos]: "50%",
      [dim.align]: "center",
      borderRadius: borderRadius,
      backgroundColor: color.track,
      padding: padding,
      transition: formattedTransition,
    },
    thumb: {
      [dim.thickness]: thickness.thumb,
      borderRadius: borderRadius,
      backgroundColor: color.thumb,
      transition: formattedTransition,
    },
  };
}

export function getHoverStyle(
  axis: Axis,
  quickStyle: QuickStyle,
): Thumb & Track {
  const { thickness, color, paddingHover } = quickStyle;
  const dim = AXIS_DIMENSION[axis];

  return {
    thumb: {
      [dim.thickness]: thickness.thumbHover,
      backgroundColor: color.thumbHover,
    },
    track: {
      [dim.thickness]: thickness.trackHover,
      backgroundColor: color.trackHover,
      padding: paddingHover,
    },
  };
}
