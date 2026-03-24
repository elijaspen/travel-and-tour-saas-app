import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "@testing-library/jest-dom";

describe("Tabs Component", () => {
  const TestTabs = ({ orientation = "horizontal" as const, variant = "default" as const }) => (
    <Tabs defaultValue="account" orientation={orientation} data-testid="tabs">
      <TabsList variant={variant}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account Content</TabsContent>
      <TabsContent value="password">Password Content</TabsContent>
      <TabsContent value="settings">Settings Content</TabsContent>
    </Tabs>
  );

  it("renders correctly and shows default content", () => {
    render(<TestTabs />);

    // Initial state
    expect(screen.getByText("Account Content")).toBeVisible();
    expect(screen.queryByText("Password Content")).not.toBeInTheDocument();

    // Check aria attributes on triggers
    const accountTrigger = screen.getByRole("tab", { name: /account/i });
    expect(accountTrigger).toHaveAttribute("aria-selected", "true");
  });

  it("switches content when a different tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    const passwordTrigger = screen.getByRole("tab", { name: /password/i });

    await user.click(passwordTrigger);

    // New content should be visible
    expect(screen.getByText("Password Content")).toBeVisible();
    // Old content should be removed or hidden (Radix removes it from DOM by default)
    expect(screen.queryByText("Account Content")).not.toBeInTheDocument();
    expect(passwordTrigger).toHaveAttribute("aria-selected", "true");
  });

  it("does not switch tabs when a disabled trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    const settingsTrigger = screen.getByRole("tab", { name: /settings/i });
    expect(settingsTrigger).toBeDisabled();

    await user.click(settingsTrigger);

    // Content should still be the default
    expect(screen.getByText("Account Content")).toBeVisible();
    expect(screen.queryByText("Settings Content")).not.toBeInTheDocument();
  });

  it("applies the correct data attributes for orientation", () => {
    const { rerender } = render(<TestTabs data-testid="test-tab" orientation="horizontal" />);
    expect(screen.getByTestId("tabs")).toHaveAttribute("data-orientation", "horizontal");

    rerender(<TestTabs orientation="vertical" />);
    expect(screen.getByTestId("tabs")).toHaveAttribute("data-orientation", "vertical");
  });

  it("applies the variant classes correctly to TabsList", () => {
    render(<TestTabs variant="line" />);
    const list = screen.getByRole("tablist");

    // Verify the data-variant attribute used in your CVA/styling
    expect(list).toHaveAttribute("data-variant", "line");
    expect(list).toHaveClass("bg-transparent"); // Class from 'line' variant
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    const accountTrigger = screen.getByRole("tab", { name: /account/i });

    // Focus the first tab
    accountTrigger.focus();
    expect(accountTrigger).toHaveFocus();

    // Press ArrowRight to move to the next tab
    await user.keyboard("{ArrowRight}");

    const passwordTrigger = screen.getByRole("tab", { name: /password/i });
    expect(passwordTrigger).toHaveFocus();
    expect(screen.getByText("Password Content")).toBeVisible();
  });
});
