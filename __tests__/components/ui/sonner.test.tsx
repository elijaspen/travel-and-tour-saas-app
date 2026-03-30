import { render } from "@testing-library/react";
import { Toaster } from "@/components/ui/sonner";

// Mock window.matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Toaster component", () => {
  it("renders toaster without crashing", () => {
    const { container } = render(<Toaster />);
    // The Toaster component renders an empty portal by default until a toast is shown
    expect(container).toBeTruthy();
  });
});
