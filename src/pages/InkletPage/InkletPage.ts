import type { Page } from "@/types/pages";

import Toolbox from "@/components/Toolbox/Toolbox";

import { drawStore } from "@/stores/drawStore";

import "@/pages/InkletPage/InkletPage.css";

const InkletPage = (): Page => {
  const divRoot = document.createElement("div") as Page;
  divRoot.className = "";

  divRoot.innerHTML = `
    <canvas class="canvas" id="canvas" width="800px" height="600px"></canvas>
  `;

  const canvas = divRoot.querySelector<HTMLCanvasElement>(".canvas");
  const ctx = canvas!.getContext("2d");
  drawStore.setCanvasContext(ctx);

  const toolbox = Toolbox();

  divRoot.append(toolbox);

  let isPressed = false;
  let x: number | null = null;
  let y: number | null = null;

  const handleMouseDown = (e: MouseEvent): void => {
    isPressed = true;
    x = e.offsetX;
    y = e.offsetY;
  };

  const handleMouseUp = (): void => {
    isPressed = false;
    x = null;
    y = null;
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const { canvasCtx, size, color } = drawStore.getState();

    if (!isPressed || !canvasCtx) return;

    const x2 = e.offsetX;
    const y2 = e.offsetY;

    canvasCtx.beginPath();
    canvasCtx.arc(x!, y!, size, 0, Math.PI * 2);
    canvasCtx.fillStyle = color;
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.moveTo(x!, y!);
    canvasCtx.lineTo(x2, y2);
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = size * 2;
    canvasCtx.stroke();

    x = x2;
    y = y2;
  };

  canvas!.addEventListener("mousedown", handleMouseDown);
  canvas!.addEventListener("mouseup", handleMouseUp);
  canvas!.addEventListener("mousemove", handleMouseMove);

  divRoot.cleanup = (): void => {
    canvas!.removeEventListener("mousedown", handleMouseDown);
    canvas!.removeEventListener("mouseup", handleMouseUp);
    canvas!.removeEventListener("mousemove", handleMouseMove);

    toolbox.cleanup?.();

    drawStore.setCanvasContext(null);
  };

  return divRoot;
};

export default InkletPage;
