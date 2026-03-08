import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { CONTAINER_STYLE } from "../style/defaultStyles";
import type { ScrollDirection, UserStyleConfig } from "../types";
import { Scrollbar } from "../view/Scrollbar";
import { createScrollSystem } from "../core/createScrollSystem";

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
  const systemRef = useRef<ReturnType<typeof createScrollSystem> | null>(null);

  useLayoutEffect(() => {
    if (!scrollAreaRef.current) return;
    systemRef.current = createScrollSystem(scrollAreaRef.current);
  }, []);

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
  }, [scrollDirection]);

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

      {systemRef.current && (
        <>
          {showY && (
            <Scrollbar
              axis="y"
              system={systemRef.current}
              scrollAreaRef={scrollAreaRef}
              scrollAreaId={scrollAreaId}
            />
          )}
          {showX && (
            <Scrollbar
              axis="x"
              system={systemRef.current}
              scrollAreaRef={scrollAreaRef}
              scrollAreaId={scrollAreaId}
            />
          )}
        </>
      )}
    </div>
  );
}
