import { useEffect, useId, useRef, useState } from "react";
import type { ScrollDirection, UserStyleConfig } from "../types";
import {
  CONTAINER_STYLE,
  getScrollAreaStyle,
} from "../scrollbar/view/styling/defaultStyleConfig";
import { Scrollbar } from "./scrollbar";

type DivScrollbarProps = {
  children?: React.ReactNode;
  customStyle?: UserStyleConfig;
  scrollDirection?: ScrollDirection;
};

export function DivScrollbar({
  children,
  customStyle = {},
  scrollDirection = "y",
}: DivScrollbarProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaId = useId();

  const [autoX, setAutoX] = useState(false);
  const [autoY, setAutoY] = useState(false);

  useEffect(() => {
    if (scrollDirection !== "auto") return;

    const el = scrollAreaRef.current;
    if (!el) return;

    const update = () => {
      setAutoY(el.scrollHeight > el.clientHeight);
      setAutoX(el.scrollWidth > el.clientWidth);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [scrollDirection, children]);

  const showY =
    scrollDirection === "y" || (scrollDirection === "auto" && autoY);
  const showX =
    scrollDirection === "x" || (scrollDirection === "auto" && autoX);

  return (
    <div style={CONTAINER_STYLE}>
      {/* content */}
      <div
        role="region"
        aria-label="Scrollable content"
        ref={scrollAreaRef}
        id={scrollAreaId}
        style={getScrollAreaStyle(scrollDirection)}
      >
        {children}
      </div>

      {/* scrollbars */}
      {showY && (
        <Scrollbar
          axis="y"
          scrollAreaRef={scrollAreaRef}
          scrollAreaId={scrollAreaId}
          customStyle={customStyle}
        />
      )}
      {showX && (
        <Scrollbar
          axis="x"
          scrollAreaRef={scrollAreaRef}
          scrollAreaId={scrollAreaId}
          customStyle={customStyle}
        />
      )}
    </div>
  );
}
