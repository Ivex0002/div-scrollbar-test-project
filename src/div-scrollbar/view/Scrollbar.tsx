import { useRef, useState } from "react";
import { AXIS_CONFIG } from "../style/constants";
import type { Axis, ScrollSystem } from "../types";

type ScrollbarProps = {
  axis: Axis;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  scrollAreaId: string;
  system: ScrollSystem;
};

export function Scrollbar({
  axis,
  scrollAreaRef,
  scrollAreaId,
  system,
}: ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const model = axis === "y" ? system.modelY : system.modelX;
  const controller = axis === "y" ? system.controllerY : system.controllerX;

  const [isHover, setIsHover] = useState(false);

  const cfg = AXIS_CONFIG[axis];

  return (
    <div
      className="layout"
      ref={layoutRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="track" ref={trackRef}>
        <div
          ref={thumbRef}
          role="scrollbar"
          tabIndex={0}
          aria-orientation={cfg.orientation}
          aria-controls={scrollAreaId}
          aria-valuemin={0}
          aria-valuemax={model.getSnapshot().max}
          aria-valuenow={model.getSnapshot().current}
          //   onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}
