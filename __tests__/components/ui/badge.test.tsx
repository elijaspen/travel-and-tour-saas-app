import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { render, screen } from "@testing-library/react";

describe("Badge component", () => {
  it("renders badge with text", () => {
    render(<Badge>99+</Badge>);
    const badge = screen.getByText(/99+/i);
    expect(badge).toBeInTheDocument();
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveAttribute("data-variant", "destructive");
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveAttribute("data-variant", "outline");
  });

  it("renders with ghost variant", () => {
    render(<Badge variant="ghost">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveAttribute("data-variant", "ghost");
  });

  it("renders with link variant", () => {
    render(<Badge variant="link">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveAttribute("data-variant", "link");
  });

  it("renders badge as child when asChild is true", () => {
    render(
      <Badge asChild>
        <Label>Sample Text</Label>
      </Badge>,
    );
    const badge = screen.getByText(/sample text/i);
    expect(badge).toBeInTheDocument();
  });

  it("applies identifier name", () => {
    render(<Badge id="my-id">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveAttribute("id");
  });

  it("applies custom class name", () => {
    render(<Badge className="my-class">Sample Text</Badge>);
    const badge = screen.getByText(/sample text/i);
    expect(badge).toHaveClass("my-class");
  });
});
