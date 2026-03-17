import { Textarea } from "@/components/ui/textarea";
import { render, screen } from "@testing-library/react";

describe("Textarea component", () => {
  it("renders textarea correctly", () => {
    render(<Textarea data-testid="test-textarea" />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveAttribute("data-slot", "textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("renders textarea with placeholder", () => {
    render(<Textarea data-testid="test-textarea" placeholder="Sample Text" />);
    const textarea = screen.getByPlaceholderText(/sample text/i);
    expect(textarea).toHaveAttribute("data-slot", "textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("renders textarea with disabled", () => {
    render(<Textarea data-testid="test-textarea" disabled={true} />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveProperty("disabled", true);
    expect(textarea).toBeInTheDocument();
  });

  it("applies textarea with identifier name", () => {
    render(<Textarea data-testid="test-textarea" id="my-id" />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveAttribute("id", "my-id");
    expect(textarea).toBeInTheDocument();
  });

  it("applies textarea with custom class name", () => {
    render(<Textarea data-testid="test-textarea" className="my-class" />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveClass("my-class");
    expect(textarea).toBeInTheDocument();
  });

  it("applies textarea to get the value", () => {
    render(<Textarea data-testid="test-textarea" defaultValue="Sample Text" />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveValue("Sample Text");
    expect(textarea).toBeInTheDocument();
  });

  it("applies textarea to get rows and columns", () => {
    render(<Textarea data-testid="test-textarea" rows={10} cols={10} />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveAttribute("rows", "10");
    expect(textarea).toHaveAttribute("cols", "10");
    expect(textarea).toBeInTheDocument();
  });

  it("applies textarea with readonly", () => {
    render(<Textarea data-testid="test-textarea" readOnly={true} />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveProperty("readOnly", true);
    expect(textarea).toBeInTheDocument();
  });

  it("applies textarea with minumun and maximum length values", () => {
    render(<Textarea data-testid="test-textarea" minLength={5} maxLength={64} />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveProperty("minLength", 5);
    expect(textarea).toHaveProperty("maxLength", 64);
    expect(textarea).toBeInTheDocument();
  });
});
