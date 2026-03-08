export class ScrollModel {
  private state = {
    current: 0,
    max: 0,
    viewportSize: 0,
    contentSize: 0,
  };

  private listeners = new Set<() => void>();

  getSnapshot() {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setScrollPosition(value: number) {
    this.state.current = value;
    this.emit();
  }

  setMetrics(viewport: number, content: number) {
    this.state.viewportSize = viewport;
    this.state.contentSize = content;
    this.state.max = Math.max(0, content - viewport);
    this.emit();
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }
}
