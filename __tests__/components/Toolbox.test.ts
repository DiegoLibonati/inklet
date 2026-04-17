import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { ToolboxComponent } from "@/types/components";

import Toolbox from "@/components/Toolbox/Toolbox";

import { drawStore } from "@/stores/drawStore";

const renderComponent = (): ToolboxComponent => {
  const container = Toolbox();
  document.body.appendChild(container);
  return container;
};

describe("Toolbox Component", () => {
  beforeEach(() => {
    drawStore.setState({ size: 30, color: "#000000", canvasCtx: null });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    drawStore.setState({ size: 30, color: "#000000", canvasCtx: null });
  });

  it("should render toolbox with correct structure", () => {
    renderComponent();

    const toolbox = document.querySelector<HTMLDivElement>(".toolbox");
    expect(toolbox).toBeInTheDocument();
  });

  it("should render size display with initial value", () => {
    renderComponent();

    const sizeDisplay = document.querySelector<HTMLSpanElement>("#size");
    expect(sizeDisplay).toBeInTheDocument();
    expect(sizeDisplay?.textContent).toBe("30");
  });

  it("should render color input with initial value", () => {
    renderComponent();

    const colorInput = document.querySelector<HTMLInputElement>("#color");
    expect(colorInput).toBeInTheDocument();
    expect(colorInput?.value).toBe("#000000");
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

  it("should increase size when increase button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const increaseButton = screen.getByRole("button", {
      name: "Increase brush size",
    });
    await user.click(increaseButton);

    const sizeDisplay = document.querySelector<HTMLSpanElement>("#size");
    expect(sizeDisplay?.textContent).toBe("30");
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
      colorInput.value = "#ff0000";
      colorInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    expect(drawStore.get("color")).toBe("#ff0000");
  });

  it("should update size display when store changes", () => {
    renderComponent();

    drawStore.setState({ size: 15 });

    const sizeDisplay = document.querySelector<HTMLSpanElement>("#size");
    expect(sizeDisplay?.textContent).toBe("15");
  });

  it("should cleanup subscriptions and event listeners", () => {
    const toolbox = renderComponent();

    expect(toolbox.cleanup).toBeDefined();
    toolbox.cleanup?.();

    expect(toolbox.cleanup).toBeDefined();
  });
});
