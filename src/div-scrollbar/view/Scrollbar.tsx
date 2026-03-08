import { useRef } from "react";
import { AXIS_CONFIG } from "../style/constants";
import type { Axis } from "../types";

type ScrollbarProps = {
  axis: Axis;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  scrollAreaId: string;
};

export function Scrollbar({
  axis,
  scrollAreaRef,
  scrollAreaId,
}: ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

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
          aria-valuemax={scrollState.max}
          aria-valuenow={scrollState.current}
          //   onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}
