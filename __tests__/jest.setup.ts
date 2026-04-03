import "@testing-library/jest-dom";

const mockCanvasClearRect = jest.fn();
const mockCanvasBeginPath = jest.fn();
const mockCanvasArc = jest.fn();
const mockCanvasFill = jest.fn();
const mockCanvasMoveTo = jest.fn();
const mockCanvasLineTo = jest.fn();
const mockCanvasStroke = jest.fn();

const mockCanvasGetContext = jest.fn((contextType: string) => {
  if (contextType === "2d") {
    return {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      clearRect: mockCanvasClearRect,
      beginPath: mockCanvasBeginPath,
      arc: mockCanvasArc,
      fill: mockCanvasFill,
      moveTo: mockCanvasMoveTo,
      lineTo: mockCanvasLineTo,
      stroke: mockCanvasStroke,
    } as unknown as CanvasRenderingContext2D;
  }
  return null;
});

HTMLCanvasElement.prototype.getContext =
  mockCanvasGetContext as typeof HTMLCanvasElement.prototype.getContext;
