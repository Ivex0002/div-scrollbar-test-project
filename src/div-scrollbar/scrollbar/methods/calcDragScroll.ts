export function calcDragScroll({
  delta,
  startScroll,
  visible,
  total,
  trackSize,
  thumbSize,
}: {
  delta: number;
  startScroll: number;
  visible: number;
  total: number;
  trackSize: number;
  thumbSize: number;
}) {
  const scrollRatio = (total - visible) / (trackSize - thumbSize);
  return startScroll + delta * scrollRatio;
}
