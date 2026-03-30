import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust path
import "@testing-library/jest-dom";

// Mock ResizeObserver which is required by Radix UI primitives
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Dialog Component", () => {
  const TestDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <button>Open Dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div>Main Content</div>
        <DialogFooter showCloseButton>
          <button>Submit</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  it("should not show content initially", () => {
    render(<TestDialog />);
    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
  });

  it("should open the dialog when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByText(/open dialog/i));

    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog Description")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("should close the dialog when the default X button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    // Open
    await user.click(screen.getByText(/open dialog/i));

    // The X button has an sr-only text "Close"
    const closeButton = screen.getAllByRole("button", { name: /close/i });
    await user.click(closeButton[0]);

    // Wait for animation/removal from DOM
    await waitFor(() => {
      expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
    });
  });

  it("should close the dialog when the footer close button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByText(/open dialog/i));

    // Footer button (variant outline) specifically rendered in our component
    const footerClose = screen
      .getAllByRole("button", { name: /close/i })
      .find((btn) => btn.textContent === "Close");

    if (footerClose) await user.click(footerClose);

    await waitFor(() => {
      expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
    });
  });

  it("hides the close button when showCloseButton prop is false", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <p>No X button here</p>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText("Open"));

    // Check that the SR-only "Close" (X button) is not there
    expect(screen.queryByText("Close")).not.toBeInTheDocument();
  });

  it("allows clicking outside to close by default (Radix behavior)", async () => {
    const user = userEvent.setup();
    render(<TestDialog data-testid="test-dialog-overlay" />);

    await user.click(screen.getByText(/open dialog/i));

    // Click on the overlay (identified by data-slot)
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    if (overlay) {
      await user.click(overlay as Element);
    }

    await waitFor(() => {
      expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
    });
  });
});
