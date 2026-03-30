import { Label } from "@/components/ui/label";
import { render, screen } from "@testing-library/react";

describe("Label component", () => {
  it("renders label correctly", () => {
    render(<Label>Sample Text</Label>);
    const label = screen.getByText(/sample text/i);
    expect(label.closest('[data-slot="label"]')).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });
});
