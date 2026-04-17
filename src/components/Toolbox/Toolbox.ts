import type { ToolboxComponent } from "@/types/components";

import Button from "@/components/Button/Button";

import { drawStore } from "@/stores/drawStore";

import "@/components/Toolbox/Toolbox.css";

const handleIncreaseSize = (): void => {
  drawStore.increaseSize();
};

const handleDecreaseSize = (): void => {
  drawStore.decreaseSize();
};

const handleSetColor = (e: Event): void => {
  const value = (e.target as HTMLInputElement).value;
  drawStore.setColor(value);
};

const handleClearCanvas = (): void => {
  const { canvasCtx } = drawStore.getState();

  const canvas = document.querySelector<HTMLCanvasElement>(".canvas");

  if (canvasCtx && canvas) {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

const Toolbox = (): ToolboxComponent => {
  const { size, color } = drawStore.getState();

  const divRoot = document.createElement("div") as ToolboxComponent;
  divRoot.className = "toolbox";

  divRoot.innerHTML = `
    <span id="size" class="toolbox__size">${size}</span>

    <input type="color" id="color" class="toolbox__input-color" value="${color}" />
  `;

  const toolboxSize = divRoot.querySelector<HTMLSpanElement>(".toolbox__size");
  const toolboxInputColor = divRoot.querySelector<HTMLInputElement>(
    ".toolbox__input-color"
  );

  const buttonIncrease = Button({
    id: "increase",
    ariaLabel: "Increase brush size",
    className: "toolbox__btn-increase",
    children: "+",
  });

  const buttonDecrease = Button({
    id: "decrease",
    ariaLabel: "Decrease brush size",
    className: "toolbox__btn-decrease",
    children: "-",
  });

  const buttonClear = Button({
    id: "clear",
    ariaLabel: "Clear canvas",
    className: "toolbox__btn-clear",
    children: "Clear",
  });

  divRoot.insertBefore(buttonIncrease, toolboxSize);
  divRoot.insertBefore(buttonDecrease, toolboxInputColor);
  divRoot.append(buttonClear);

  const handleColorChange = (e: Event): void => {
    handleSetColor(e);
  };

  buttonIncrease.addEventListener("click", handleIncreaseSize);
  buttonDecrease.addEventListener("click", handleDecreaseSize);
  buttonClear.addEventListener("click", handleClearCanvas);
  toolboxInputColor?.addEventListener("change", handleColorChange);

  const renderSize = (): void => {
    const { size } = drawStore.getState();

    const toolboxSize =
      divRoot.querySelector<HTMLSpanElement>(".toolbox__size");

    if (String(size) === toolboxSize?.textContent) return;

    if (toolboxSize) {
      toolboxSize.textContent = String(size);
    }
  };

  const unsubscribe = drawStore.subscribe("size", renderSize);

  divRoot.cleanup = (): void => {
    unsubscribe();

    buttonIncrease.removeEventListener("click", handleIncreaseSize);
    buttonDecrease.removeEventListener("click", handleDecreaseSize);
    buttonClear.removeEventListener("click", handleClearCanvas);
    toolboxInputColor?.removeEventListener("change", handleColorChange);

    buttonIncrease.cleanup?.();
    buttonDecrease.cleanup?.();
    buttonClear.cleanup?.();
  };

  return divRoot;
};

export default Toolbox;
