import { ScrollModel } from "./ScrollModel";

export function createScrollSystem(element: HTMLElement) {
  const modelX = new ScrollModel();
  const modelY = new ScrollModel();

  const controllerX = new ScrollController(modelX, element, "x");
  const controllerY = new ScrollController(modelY, element, "y");

  return {
    modelX,
    modelY,
    controllerX,
    controllerY,
  };
}
