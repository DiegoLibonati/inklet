import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { ButtonProps } from "@/types/props";
import type { ButtonComponent } from "@/types/components";

import Button from "@/components/Button/Button";

const mockOnClick = jest.fn();

const defaultProps: ButtonProps = {
  id: "test-button",
  ariaLabel: "Test button",
  children: "Click Me",
  onClick: mockOnClick,
};

const renderComponent = (props: Partial<ButtonProps> = {}): ButtonComponent => {
  const container = Button({ ...defaultProps, ...props });
  document.body.appendChild(container);
  return container;
};

describe("Button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render button with correct attributes", () => {
      renderComponent();

      const button = screen.getByRole("button", { name: "Test button" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toHaveTextContent("Click Me");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should render submit button when type is submit", () => {
      renderComponent({ type: "submit" });

      const button = screen.getByRole("button", { name: "Test button" });
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should apply className when provided", () => {
      renderComponent({ className: "custom-button" });

      const button = screen.getByRole("button", { name: "Test button" });
      expect(button).toHaveClass("custom-button");
    });
  });

  describe("behavior", () => {
    it("should call onClick handler when clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole("button", { name: "Test button" });
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanup", () => {
    it("should not add cleanup for submit button", () => {
      const button = renderComponent({ type: "submit" });

      expect(button.cleanup).toBeUndefined();
    });

    it("should remove event listener after cleanup", async () => {
      const user = userEvent.setup();
      const button = renderComponent();

      button.cleanup?.();

      const buttonElement = screen.getByRole("button", { name: "Test button" });
      await user.click(buttonElement);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
