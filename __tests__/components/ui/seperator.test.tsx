import { Separator } from "@/components/ui/separator";
import { render, screen } from "@testing-library/react";

describe("separator Components", () => {
  it("renders separator correctly", () => {
    render(<Separator data-testid="test-separator" />);
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toBeInTheDocument();
  });

  it("renders separator with horizontal orientation", () => {
    render(<Separator data-testid="test-separator" orientation="horizontal" />);
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toBeInTheDocument();
  });
});
