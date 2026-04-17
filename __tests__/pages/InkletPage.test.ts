import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";

import InkletPage from "@/pages/InkletPage/InkletPage";

import { drawStore } from "@/stores/drawStore";

const createMouseEvent = (
  type: string,
  offsetX = 0,
  offsetY = 0
): MouseEvent => {
  const event = new MouseEvent(type, { bubbles: true });
  Object.defineProperty(event, "offsetX", {
    value: offsetX,
    configurable: true,
  });
  Object.defineProperty(event, "offsetY", {
    value: offsetY,
    configurable: true,
  });
  return event;
};

const renderPage = (): Page => {
  const page = InkletPage();
  document.body.appendChild(page);
  return page;
};

describe("InkletPage", () => {
  let page: Page;

  afterEach(() => {
    page.cleanup?.();
    document.body.innerHTML = "";
    drawStore.setState({ size: 30, color: "#000000", canvasCtx: null });
  });

  describe("rendering", () => {
    it("should render a canvas element", () => {
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("should render the canvas with correct dimensions", () => {
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas");
      expect(canvas).toHaveAttribute("width", "800px");
      expect(canvas).toHaveAttribute("height", "600px");
    });

    it("should render the toolbox", () => {
      page = renderPage();
      const toolbox = document.querySelector<HTMLDivElement>(".toolbox");
      expect(toolbox).toBeInTheDocument();
    });

    it("should render toolbox buttons", () => {
      page = renderPage();
      expect(
        screen.getByRole("button", { name: "Increase brush size" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Decrease brush size" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Clear canvas" })
      ).toBeInTheDocument();
    });
  });

  describe("canvas context", () => {
    it("should set canvasCtx in the store on mount", () => {
      page = renderPage();
      expect(drawStore.get("canvasCtx")).not.toBeNull();
    });

    it("should set canvasCtx to null on cleanup", () => {
      page = renderPage();
      page.cleanup?.();
      expect(drawStore.get("canvasCtx")).toBeNull();
    });
  });

  describe("drawing behavior", () => {
    it("should not draw when mousemove fires without mousedown", () => {
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
      const ctx = drawStore.get("canvasCtx");

      canvas.dispatchEvent(createMouseEvent("mousemove", 50, 50));

      expect(ctx?.beginPath as jest.Mock).not.toHaveBeenCalled();
    });

    it("should draw when mousemove fires after mousedown", () => {
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
      const ctx = drawStore.get("canvasCtx");

      canvas.dispatchEvent(createMouseEvent("mousedown", 10, 10));
      canvas.dispatchEvent(createMouseEvent("mousemove", 20, 20));

      expect(ctx?.beginPath as jest.Mock).toHaveBeenCalled();
      expect(ctx?.arc as jest.Mock).toHaveBeenCalled();
      expect(ctx?.stroke as jest.Mock).toHaveBeenCalled();
    });

    it("should stop drawing after mouseup", () => {
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
      const ctx = drawStore.get("canvasCtx");

      canvas.dispatchEvent(createMouseEvent("mousedown", 10, 10));
      canvas.dispatchEvent(createMouseEvent("mouseup"));

      const mockBeginPath = ctx?.beginPath as jest.Mock;
      mockBeginPath.mockClear();

      canvas.dispatchEvent(createMouseEvent("mousemove", 30, 30));

      expect(mockBeginPath).not.toHaveBeenCalled();
    });

    it("should use store color and size when drawing", () => {
      drawStore.setState({ color: "#ff0000", size: 15 });
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
      const ctx = drawStore.get("canvasCtx") as unknown as Record<
        string,
        unknown
      >;

      canvas.dispatchEvent(createMouseEvent("mousedown", 10, 10));
      canvas.dispatchEvent(createMouseEvent("mousemove", 20, 20));

      expect(ctx.fillStyle).toBe("#ff0000");
      expect(ctx.strokeStyle).toBe("#ff0000");
      expect(ctx.lineWidth).toBe(30);
    });
  });

  describe("cleanup", () => {
    it("should define a cleanup function", () => {
      page = renderPage();
      expect(page.cleanup).toBeDefined();
    });

    it("should remove canvas event listeners on cleanup", () => {
      page = renderPage();
      const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
      const ctx = drawStore.get("canvasCtx");

      canvas.dispatchEvent(createMouseEvent("mousedown", 10, 10));
      page.cleanup?.();

      const mockBeginPath = ctx?.beginPath as jest.Mock;
      mockBeginPath.mockClear();

      canvas.dispatchEvent(createMouseEvent("mousemove", 20, 20));

      expect(mockBeginPath).not.toHaveBeenCalled();
    });
  });
});
