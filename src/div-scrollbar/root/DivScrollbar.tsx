import { useEffect, useId, useRef, useState } from "react";
import { CONTAINER_STYLE } from "../style/defaultStyles";
import type { ScrollDirection, UserStyleConfig } from "../types";

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

  // auto option
  const [autoX, setAutoX] = useState(false);
  const [autoY, setAutoY] = useState(false);

  // handle auto
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

  // show variables
  const showY =
    scrollDirection === "y" || (scrollDirection === "auto" && autoY);
  const showX =
    scrollDirection === "x" || (scrollDirection === "auto" && autoX);

  return (
    <div style={CONTAINER_STYLE}>
      <div
        role="region"
        aria-label="Scrollable content"
        ref={scrollAreaRef}
        id={scrollAreaId}
        // style={getScrollAreaStyle(scrollDirection)}
      >
        {children}
      </div>
    </div>
  );
}
