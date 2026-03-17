import { render, screen } from "@testing-library/react";
import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox component", () => {
  it("renders the checkbox", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("renders checkbox to be checked", () => {
    render(<Checkbox checked={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toBeChecked();
  });

  it("renders the checkbox to be disabled", () => {
    render(<Checkbox disabled={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toBeDisabled();
  });
});
