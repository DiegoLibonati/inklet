const mockCtxClearReact = jest.fn();

export const mockCtx = {
  fillStyle: "",
  strokeStyle: "",
  clearRect: mockCtxClearReact,
} as unknown as CanvasRenderingContext2D;
