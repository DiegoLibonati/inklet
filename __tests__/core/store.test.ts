import type { Listener } from "@/types/store";

import { Store } from "@/core/store";

interface TestState extends Record<string, unknown> {
  count: number;
  name: string;
}

class TestStore extends Store<TestState> {
  constructor() {
    super({ count: 0, name: "test" });
  }
}

describe("Store", () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  describe("getState", () => {
    it("should return the initial state", () => {
      expect(store.getState()).toEqual({ count: 0, name: "test" });
    });

    it("should return updated state after setState", () => {
      store.setState({ count: 5 });
      expect(store.getState()).toEqual({ count: 5, name: "test" });
    });
  });

  describe("get", () => {
    it("should return the value for a given key", () => {
      expect(store.get("count")).toBe(0);
      expect(store.get("name")).toBe("test");
    });

    it("should return updated value after setState", () => {
      store.setState({ count: 10 });
      expect(store.get("count")).toBe(10);
    });
  });

  describe("setState", () => {
    it("should merge partial state without affecting other keys", () => {
      store.setState({ count: 7 });
      expect(store.get("count")).toBe(7);
      expect(store.get("name")).toBe("test");
    });

    it("should notify listener when a value changes", () => {
      const mockListener = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 3 });
      expect(mockListener).toHaveBeenCalledWith(3);
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it("should not notify listener when the value does not change", () => {
      const mockListener = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 0 });
      expect(mockListener).not.toHaveBeenCalled();
    });

    it("should notify multiple listeners for the same key", () => {
      const mockListenerA = jest.fn();
      const mockListenerB = jest.fn();
      store.subscribe("count", mockListenerA);
      store.subscribe("count", mockListenerB);
      store.setState({ count: 1 });
      expect(mockListenerA).toHaveBeenCalledWith(1);
      expect(mockListenerB).toHaveBeenCalledWith(1);
    });

    it("should only notify listeners for keys that changed", () => {
      const mockCountListener = jest.fn();
      const mockNameListener = jest.fn();
      store.subscribe("count", mockCountListener);
      store.subscribe("name", mockNameListener);
      store.setState({ count: 5 });
      expect(mockCountListener).toHaveBeenCalled();
      expect(mockNameListener).not.toHaveBeenCalled();
    });
  });

  describe("subscribe", () => {
    it("should call listener on subsequent state changes", () => {
      const mockListener: Listener<number> = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 1 });
      store.setState({ count: 2 });
      expect(mockListener).toHaveBeenCalledTimes(2);
    });

    it("should return an unsubscribe function that removes the listener", () => {
      const mockListener = jest.fn();
      const unsubscribe = store.subscribe("count", mockListener);
      unsubscribe();
      store.setState({ count: 5 });
      expect(mockListener).not.toHaveBeenCalled();
    });

    it("should not affect other listeners when unsubscribing one", () => {
      const mockListenerA = jest.fn();
      const mockListenerB = jest.fn();
      const unsubscribe = store.subscribe("count", mockListenerA);
      store.subscribe("count", mockListenerB);
      unsubscribe();
      store.setState({ count: 5 });
      expect(mockListenerA).not.toHaveBeenCalled();
      expect(mockListenerB).toHaveBeenCalledWith(5);
    });
  });
});
