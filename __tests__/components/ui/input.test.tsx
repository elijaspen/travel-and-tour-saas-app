import { Input } from "@/components/ui/input";
import { render, screen } from "@testing-library/react";

describe("Input component", () => {
  it("renders input correctly", () => {
    render(<Input type="text" placeholder="Sample Text" />);
    const input = screen.getByPlaceholderText(/sample text/i);
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toBeInTheDocument();
  });
  it("renders input with placeholder", () => {
    render(<Input type="text" placeholder="Sample Text" />);
    const input = screen.getByPlaceholderText(/sample text/i);
    expect(input).toBeInTheDocument();
  });

  it("renders input to be disabled", () => {
    render(<Input placeholder="Sample Text" disabled={true} />);
    const input = screen.getByPlaceholderText(/sample text/i);
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toBeDisabled();
  });

  it("renders input to be required", () => {
    render(<Input placeholder="Sample Text" required={true} />);
    const input = screen.getByPlaceholderText(/sample text/i);
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toBeRequired();
  });
});
