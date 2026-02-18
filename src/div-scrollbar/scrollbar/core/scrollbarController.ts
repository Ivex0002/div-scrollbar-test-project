import type { AxisConfig } from "../../types";

export class ScrollController {
  constructor(
    private el: HTMLDivElement,
    private cfg: AxisConfig,
  ) {}

  getMax() {
    return this.el[this.cfg.scrollSize] - this.el[this.cfg.clientSize];
  }

  scrollTo(target: number) {
    const max = this.getMax();
    const clamped = Math.max(0, Math.min(target, max));
    this.el[this.cfg.scrollPos] = clamped;
  }

  scrollBy(delta: number) {
    this.scrollTo(this.el[this.cfg.scrollPos] + delta);
  }

  scrollWithAnimation(target: number) {
    // animateScroll 내부 호출
  }
}
