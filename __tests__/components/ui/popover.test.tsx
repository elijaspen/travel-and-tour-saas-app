import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"; // Adjust path
import "@testing-library/jest-dom";

// Mock ResizeObserver for Radix UI positioning
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Popover Component", () => {
  const TestPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button>Open Popover</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Settings</PopoverTitle>
          <PopoverDescription>Manage your preferences.</PopoverDescription>
        </PopoverHeader>
        <div data-testid="popover-body">Inner Content</div>
      </PopoverContent>
    </Popover>
  );

  it("should not be visible by default", () => {
    render(<TestPopover />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("should open and display content when clicked", async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    const trigger = screen.getByRole("button", { name: /open popover/i });
    await user.click(trigger);

    // Using findBy to allow for Radix's internal state transitions
    expect(await screen.findByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage your preferences.")).toBeInTheDocument();
    expect(screen.getByTestId("popover-body")).toBeInTheDocument();
  });

  it("should close when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside Area</div>
        <TestPopover />
      </div>,
    );

    // Open it first
    await user.click(screen.getByRole("button", { name: /open popover/i }));
    expect(await screen.findByText("Settings")).toBeInTheDocument();

    // Click outside
    await user.click(screen.getByTestId("outside"));

    // Wait for the content to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });
  });

  it("should close when pressing the Escape key", async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole("button", { name: /open popover/i }));
    expect(await screen.findByText("Settings")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });
  });

  it("passes custom classNames and align props correctly", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="custom-popover" align="start">
          Content
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText("Open"));

    const content = await screen.findByText("Content");
    expect(content).toHaveClass("custom-popover");
    // Radix applies alignment via data attributes
    expect(content).toHaveAttribute("data-align", "start");
  });
});
