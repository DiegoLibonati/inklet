import { DrawingStore } from "@/stores/drawingStore";

import { mockCtx } from "@tests/__mocks__/ctx.mock";

describe("DrawingStore", () => {
  let store: DrawingStore;

  beforeEach(() => {
    store = new DrawingStore({
      size: 30,
      color: "#000000",
      canvasCtx: null,
    });
  });

  it("should initialize with correct state", () => {
    const state = store.getState();

    expect(state.size).toBe(30);
    expect(state.color).toBe("#000000");
    expect(state.canvasCtx).toBeNull();
  });

  it("should increase size", () => {
    store.setState({ size: 10 });

    store.increaseSize();

    expect(store.get("size")).toBe(11);
  });

  it("should not increase size beyond max of 30", () => {
    store.setState({ size: 30 });

    store.increaseSize();

    expect(store.get("size")).toBe(30);
  });

  it("should decrease size", () => {
    store.setState({ size: 10 });

    store.decreaseSize();

    expect(store.get("size")).toBe(9);
  });

  it("should not decrease size below min of 1", () => {
    store.setState({ size: 1 });

    store.decreaseSize();

    expect(store.get("size")).toBe(1);
  });

  it("should set color", () => {
    store.setColor("#ff0000");

    expect(store.get("color")).toBe("#ff0000");
  });

  it("should set canvas context", () => {
    store.setCanvasContext(mockCtx);

    expect(store.get("canvasCtx")).toBe(mockCtx);
  });

  it("should set canvas context to null", () => {
    store.setCanvasContext(mockCtx);
    store.setCanvasContext(null);

    expect(store.get("canvasCtx")).toBeNull();
  });

  it("should notify listeners when size changes", () => {
    const mockListener = jest.fn();

    store.setState({ size: 10 });
    store.subscribe("size", mockListener);
    store.increaseSize();

    expect(mockListener).toHaveBeenCalledWith(11);
  });
});
