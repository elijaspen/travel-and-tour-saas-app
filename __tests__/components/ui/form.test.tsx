import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

// Helper component to wrap with FormProvider
function TestForm({ children }: { children?: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { username: "" },
    mode: "onChange",
  });
  return (
    <Form {...methods}>
      {children || (
        <FormField
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input {...field} data-testid="username-input" />
              </FormControl>
              <FormDescription>This is your public name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {!children && (
        <button type="submit" onClick={methods.handleSubmit(() => {})}>
          Submit
        </button>
      )}
    </Form>
  );
}

describe("Form components", () => {
  it("renders FormItem with slot attribute", () => {
    render(
      <TestForm>
        <FormItem>
          <div>Item Content</div>
        </FormItem>
      </TestForm>,
    );
    const itemContent = screen.getByText("Item Content");
    expect(itemContent.parentElement).toHaveAttribute("data-slot", "form-item");
  });

  it("renders FormLabel linked to control", () => {
    render(
      <TestForm>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>,
    );

    const label = screen.getByText("Username");
    const input = screen.getByRole("textbox");

    expect(label.closest('[data-slot="form-label"]')).toBeInTheDocument();
    // The label should have htmlFor pointing to the input ID
    const labelElement = label.closest('label');
    expect(labelElement).toHaveAttribute("for", input.id);
  });

  it("displays validation error message on invalid submission", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    // Click submit without entering data
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // FormMessage should appear
    const errorMessage = await screen.findByText(/username is required/i);
    expect(errorMessage).toBeInTheDocument();

    // Check if aria-invalid is set on the input
    const input = screen.getByTestId("username-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("updates the input value and clears error on change", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const input = screen.getByTestId("username-input");

    // Type into input
    await user.type(input, "johndoe");
    expect(input).toHaveValue("johndoe");

    // Error should not be visible (or should disappear)
    expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
  });

  it("applies error styles to the label when there is an error", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const labelWrapper = screen.getAllByText(/username/i)[0].closest('[data-slot="form-label"]');
      expect(labelWrapper).toHaveAttribute("data-error", "true");
      expect(labelWrapper).toHaveClass("data-[error=true]:text-destructive");
    });
  });

  it("sets correct aria-describedby for accessibility", () => {
    render(<TestForm />);

    const input = screen.getByTestId("username-input");
    const description = screen.getByText(/this is your public name/i);

    // Input should be described by the description text
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(description.id));
  });
});
