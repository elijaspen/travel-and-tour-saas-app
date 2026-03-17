import { Switch } from "@/components/ui/switch";
import { render, screen } from "@testing-library/react";

describe("Switch component", () => {
  it("renders switch correctly", () => {
    render(<Switch data-testid="test-switch" />);
    const switchComp = screen.getByTestId("test-switch");
    expect(switchComp).toHaveAttribute("data-slot", "switch");
    expect(switchComp).toBeInTheDocument();
  });

  it("applies with identifier name", () => {
    render(<Switch data-testid="test-switch" id="my-id" />);
    const switchComp = screen.getByTestId("test-switch");
    expect(switchComp).toHaveAttribute("data-slot", "switch");
    expect(switchComp).toHaveAttribute("id", "my-id");
    expect(switchComp).toBeInTheDocument();
  });

  it("applies with custom class name", () => {
    render(<Switch data-testid="test-switch" className="my-class" />);
    const switchComp = screen.getByTestId("test-switch");
    expect(switchComp).toHaveAttribute("data-slot", "switch");
    expect(switchComp).toHaveClass("my-class");
    expect(switchComp).toBeInTheDocument();
  });
});
