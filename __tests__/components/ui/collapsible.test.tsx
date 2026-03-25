import { render, screen } from "@testing-library/react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

describe("Collapsible components", () => {
  it("renders collapsible container correctly", () => {
    render(<Collapsible data-testid="test-collapsible">Sample Text</Collapsible>);
    const collapsible = screen.getByTestId("test-collapsible");
    expect(collapsible).toHaveAttribute("data-slot", "collapsible");
    expect(collapsible).toBeInTheDocument();
  });

  it("renders collapsible trigger inside a collapsible container correctly", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="test-collapsible-trigger">Sample Text</CollapsibleTrigger>,
      </Collapsible>,
    );
    const collapsibleTrigger = screen.getByTestId("test-collapsible-trigger");
    expect(collapsibleTrigger).toHaveAttribute("data-slot", "collapsible-trigger");
    expect(collapsibleTrigger).toBeInTheDocument();
  });

  it("applies collapsible container with idendtifier name", () => {
    render(
      <Collapsible data-testid="test-collapsible" id="my-id">
        Sample Text
      </Collapsible>,
    );
    const collapsible = screen.getByTestId("test-collapsible");
    expect(collapsible).toHaveAttribute("id", "my-id");
    expect(collapsible).toBeInTheDocument();
  });

  it("applies collapsible container with custom class name", () => {
    render(
      <Collapsible data-testid="test-collapsible" className="my-class">
        Sample Text
      </Collapsible>,
    );
    const collapsible = screen.getByTestId("test-collapsible");
    expect(collapsible).toHaveClass("my-class");
  });
});
