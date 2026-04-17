import type { DrawState } from "@/types/states";

import { DrawStore, drawStore } from "@/stores/drawStore";

import { mockCtx } from "@tests/__mocks__/ctx.mock";

const defaultState: DrawState = {
  size: 30,
  color: "#000000",
  canvasCtx: null,
};

describe("DrawStore", () => {
  beforeEach(() => {
    drawStore.setState(defaultState);
  });

  describe("initial state", () => {
    it("should have size 30 by default", () => {
      expect(drawStore.get("size")).toBe(30);
    });

    it("should have color #000000 by default", () => {
      expect(drawStore.get("color")).toBe("#000000");
    });

    it("should have null canvasCtx by default", () => {
      expect(drawStore.get("canvasCtx")).toBeNull();
    });
  });

  describe("increaseSize", () => {
    it("should increase size by 1", () => {
      drawStore.setState({ size: 10 });
      drawStore.increaseSize();
      expect(drawStore.get("size")).toBe(11);
    });

    it("should not exceed max size of 30", () => {
      drawStore.setState({ size: 30 });
      drawStore.increaseSize();
      expect(drawStore.get("size")).toBe(30);
    });

    it("should clamp to 30 when size reaches the max", () => {
      drawStore.setState({ size: 29 });
      drawStore.increaseSize();
      expect(drawStore.get("size")).toBe(30);
    });
  });

  describe("decreaseSize", () => {
    it("should decrease size by 1", () => {
      drawStore.setState({ size: 10 });
      drawStore.decreaseSize();
      expect(drawStore.get("size")).toBe(9);
    });

    it("should not go below min size of 1", () => {
      drawStore.setState({ size: 1 });
      drawStore.decreaseSize();
      expect(drawStore.get("size")).toBe(1);
    });

    it("should clamp to 1 when size reaches the min", () => {
      drawStore.setState({ size: 2 });
      drawStore.decreaseSize();
      expect(drawStore.get("size")).toBe(1);
    });
  });

  describe("setColor", () => {
    it("should update the color", () => {
      drawStore.setColor("#ff0000");
      expect(drawStore.get("color")).toBe("#ff0000");
    });

    it("should accept any string color value", () => {
      drawStore.setColor("blue");
      expect(drawStore.get("color")).toBe("blue");
    });
  });

  describe("setCanvasContext", () => {
    it("should set the canvasCtx", () => {
      drawStore.setCanvasContext(mockCtx);
      expect(drawStore.get("canvasCtx")).toBe(mockCtx);
    });

    it("should set canvasCtx to null", () => {
      drawStore.setCanvasContext(mockCtx);
      drawStore.setCanvasContext(null);
      expect(drawStore.get("canvasCtx")).toBeNull();
    });
  });

  describe("singleton", () => {
    it("should be an instance of DrawStore", () => {
      expect(drawStore).toBeInstanceOf(DrawStore);
    });
  });
});
