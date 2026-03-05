import type { AxisConfig } from "../../types";

type ScrollbarControllerParams = {
  el: HTMLDivElement;
  cfg: AxisConfig;
  onUpdate?: (current: number, max: number) => void;
  onDragChange: (isDragging: boolean) => void;
};

export class ScrollbarController {
  private scrollArea: HTMLDivElement;
  private cfg: AxisConfig;
  private onUpdate?: (current: number, max: number) => void;
  private onDragChange?: (isDragging: boolean) => void;

  private current = 0;
  private target = 0;
  private max = 0;

  private isAnimating = false;
  private isDragging = false;
  private rafId: number | null = null;

  private readonly ease = 0.15;

  constructor({ el, cfg, onUpdate, onDragChange }: ScrollbarControllerParams) {
    this.scrollArea = el;
    this.cfg = cfg;
    this.onUpdate = onUpdate;
    this.onDragChange = onDragChange;

    this.updateMax();
    this.current = this.scrollArea[this.cfg.scrollPos];
    this.target = this.current;
  }

  /* -------------------------------- */
  /* 기본 계산 */
  /* -------------------------------- */

  updateMax() {
    this.max =
      this.scrollArea[this.cfg.scrollSize] -
      this.scrollArea[this.cfg.clientSize];
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(value, this.max));
  }

  /* -------------------------------- */
  /* RAF 루프 */
  /* -------------------------------- */

  private loop = () => {
    if (!this.isAnimating) return;

    const diff = this.target - this.current;

    if (Math.abs(diff) < 0.5) {
      this.current = this.target;
      this.apply();
      this.stopAnimation();
      return;
    }

    this.current += diff * this.ease;
    this.apply();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.rafId = requestAnimationFrame(this.loop);
  }

  private stopAnimation() {
    this.isAnimating = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /* -------------------------------- */
  /* DOM 반영 */
  /* -------------------------------- */

  private apply() {
    this.scrollArea[this.cfg.scrollPos] = this.current;
    this.onUpdate?.(this.current, this.max);
  }

  /* -------------------------------- */
  /* 외부 입력 API */
  /* -------------------------------- */

  handleWheel(delta: number) {
    this.updateMax();
    this.target = this.clamp(this.target + delta);
    this.startAnimation();
  }

  scrollTo(value: number) {
    this.updateMax();
    this.target = this.clamp(value);
    this.startAnimation();
  }

  scrollBy(delta: number) {
    this.scrollTo(this.target + delta);
  }

  /* -------------------------------- */
  /* Drag 제어 */
  /* -------------------------------- */

  startDrag() {
    if (this.isDragging) return;
    this.isDragging = true;
    this.onDragChange?.(true);
    this.stopAnimation();
  }

  dragTo(value: number) {
    if (!this.isDragging) return;

    this.updateMax();
    this.current = this.clamp(value);
    this.target = this.current;
    this.apply();
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.onDragChange?.(false);
  }

  /* -------------------------------- */
  /* 외부에서 강제 동기화 */
  /* -------------------------------- */

  // syncFromDOM() {
  //   this.updateMax();
  //   this.current = this.scrollArea[this.cfg.scrollPos];
  //   this.target = this.current;
  // }

  destroy() {
    this.stopAnimation();
  }
}
