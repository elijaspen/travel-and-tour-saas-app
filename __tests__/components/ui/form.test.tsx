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
import "@testing-library/jest-dom";

describe("Form Components", () => {
  // A helper component to wrap our form fields in a real react-hook-form environment
  const TestForm = ({ onSubmit = jest.fn() }) => {
    const form = useForm({
      defaultValues: {
        username: "",
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input data-testid="username-input" {...field} />
                </FormControl>
                <FormDescription>This is your public name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>
    );
  };

  it("renders the label and description correctly", () => {
    render(<TestForm />);

    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/this is your public name/i)).toBeInTheDocument();
  });

  it("links the label to the input via htmlFor", () => {
    render(<TestForm />);

    const label = screen.getByText(/username/i);
    const input = screen.getByTestId("username-input");

    // Radix/shadcn generates unique IDs, check they match
    expect(label).toHaveAttribute("for", input.id);
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
    render(<TestForm data-error={true} />);

    // await user.click(screen.getByRole("button", { name: /submit/i }));

    const label = screen.getByText(/username/i);
    // The component uses data-error attribute for styling
    expect(label).toHaveAttribute("data-error", "true");
    // It should also have the destructive text class
    expect(label).toHaveClass("data-[error=true]:text-destructive");
  });

  it("sets correct aria-describedby for accessibility", () => {
    render(<TestForm />);

    const input = screen.getByTestId("username-input");
    const description = screen.getByText(/this is your public name/i);

    // Input should be described by the description text
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(description.id));
  });
});
