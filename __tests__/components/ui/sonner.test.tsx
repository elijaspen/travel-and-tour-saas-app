// Toaster.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { Toaster } from "@/components/ui/sonner";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark" }),
}));

describe("Toaster component", () => {
  it("renders with theme from useTheme", () => {
    const { container } = render(<Toaster />);
    const toaster = container.querySelector(".toaster");

    expect(toaster).toBeInTheDocument();
    // Sonner sets theme attribute internally, but we can check className
    expect(toaster).toHaveClass("group");
  });

  it("applies custom icons", () => {
    const { container } = render(<Toaster />);
    // Check that our icon classes are present
    expect(container.querySelector(".size-4")).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("applies custom CSS variables", () => {
    const { container } = render(<Toaster />);
    const toaster = container.querySelector(".toaster") as HTMLElement;

    expect(toaster.style.getPropertyValue("--normal-bg")).toBe("var(--popover)");
    expect(toaster.style.getPropertyValue("--normal-text")).toBe("var(--popover-foreground)");
    expect(toaster.style.getPropertyValue("--normal-border")).toBe("var(--border)");
    expect(toaster.style.getPropertyValue("--border-radius")).toBe("var(--radius)");
  });

  it("passes through props", () => {
    const { container } = render(<Toaster position="top-right" />);
    const toaster = container.querySelector(".toaster");

    expect(toaster).toBeInTheDocument();
    // Sonner uses props internally, so we just check it rendered
  });
});
