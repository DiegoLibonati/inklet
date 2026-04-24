import { screen, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { ToolboxComponent } from "@/types/components";

import Toolbox from "@/components/Toolbox/Toolbox";

import { drawStore } from "@/stores/drawStore";

const renderComponent = (): ToolboxComponent => {
  const container = Toolbox();
  document.body.appendChild(container);
  return container;
};

describe("Toolbox", () => {
  beforeEach(() => {
    drawStore.setState({ size: 30, color: "#000000", canvasCtx: null });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    drawStore.setState({ size: 30, color: "#000000", canvasCtx: null });
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render toolbox with correct structure", () => {
      renderComponent();

      const toolbox = document.querySelector<HTMLDivElement>(".toolbox");
      expect(toolbox).toBeInTheDocument();
    });

    it("should render size display with initial value", () => {
      renderComponent();

      const sizeDisplay = document.querySelector<HTMLSpanElement>("#size");
      expect(sizeDisplay).toBeInTheDocument();
      expect(sizeDisplay).toHaveTextContent("30");
    });

    it("should render color input with initial value", () => {
      renderComponent();

      const colorInput = document.querySelector<HTMLInputElement>("#color");
      expect(colorInput).toBeInTheDocument();
      expect(colorInput).toHaveValue("#000000");
    });

    it("should render all buttons", () => {
      renderComponent();

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

  describe("behavior", () => {
    it("should not increase size beyond max when at max", async () => {
      const user = userEvent.setup();
      renderComponent();

      const increaseButton = screen.getByRole("button", {
        name: "Increase brush size",
      });
      await user.click(increaseButton);

      const sizeDisplay = document.querySelector<HTMLSpanElement>("#size");
      expect(sizeDisplay).toHaveTextContent("30");
    });

    it("should decrease size when decrease button is clicked", async () => {
      const user = userEvent.setup();
      drawStore.setState({ size: 10 });
      renderComponent();

      const decreaseButton = screen.getByRole("button", {
        name: "Decrease brush size",
      });
      await user.click(decreaseButton);

      expect(drawStore.get("size")).toBe(9);
    });

    it("should update color when color input changes", () => {
      renderComponent();

      const colorInput = document.querySelector<HTMLInputElement>("#color");

      if (colorInput) {
        fireEvent.change(colorInput, { target: { value: "#ff0000" } });
      }

      expect(drawStore.get("color")).toBe("#ff0000");
    });

    it("should update size display when store changes", () => {
      renderComponent();

      drawStore.setState({ size: 15 });

      const sizeDisplay = document.querySelector<HTMLSpanElement>("#size");
      expect(sizeDisplay).toHaveTextContent("15");
    });
  });

  describe("cleanup", () => {
    it("should define a cleanup function", () => {
      const toolbox = renderComponent();

      expect(toolbox.cleanup).toBeDefined();
    });

    it("should call cleanup without throwing", () => {
      const toolbox = renderComponent();

      expect(() => toolbox.cleanup?.()).not.toThrow();
    });
  });
});
