// Form.test.tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
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
function TestForm({ children }: { children: ReactNode }) {
  const methods = useForm({
    defaultValues: { username: "" },
  });
  return <Form {...methods}>{children}</Form>;
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
    expect(screen.getByText("Item Content")).toHaveAttribute("data-slot", "form-item");
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

    expect(label).toHaveAttribute("data-slot", "form-label");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("renders FormDescription with correct id", () => {
    render(
      <TestForm>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription>Description text</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>,
    );

    const desc = screen.getByText("Description text");
    expect(desc).toHaveAttribute("data-slot", "form-description");
    expect(desc.id).toMatch(/form-item-description/);
  });

  it("renders FormMessage when error exists", async () => {
    const methods = useForm({
      defaultValues: { username: "" },
    });

    render(
      <Form {...methods}>
        <FormField
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>,
    );

    // Trigger validation
    await methods.trigger("username");

    const message = await screen.findByText("Username is required");
    expect(message).toHaveAttribute("data-slot", "form-message");
    expect(message).toHaveClass("text-destructive");
  });
});
