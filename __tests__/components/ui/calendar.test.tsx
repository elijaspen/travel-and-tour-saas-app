import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "@/components/ui/calendar"; // Adjust path as needed
import "@testing-library/jest-dom";

describe("Calendar Component", () => {
  it("renders the calendar with the current month by default", () => {
    render(<Calendar mode="single" />);

    // Check if the calendar root is present
    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();

    // Check if the current month's name is displayed (default behavior of DayPicker)
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
  });

  it("calls onSelect when a day is clicked in single mode", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    // Rendering for a specific month to ensure consistent test results
    const march2024 = new Date(2024, 2, 1);
    render(<Calendar mode="single" month={march2024} onSelect={onSelect} />);

    // Select the 15th of March
    const day15 = screen.getByRole("gridcell", { name: /15/i });
    const button = day15.querySelector("button");

    if (button) {
      await user.click(button);
    }

    expect(onSelect).toHaveBeenCalled();
  });

  it("applies custom classNames correctly", () => {
    const customClass = "my-custom-calendar";
    render(<Calendar mode="single" className={customClass} data-testid="test-calendar" />);

    const container = screen.getByTestId("test-calendar"); // Uses the Root component data-slot
    expect(container).toHaveClass(customClass);
  });

  it("supports range selection mode", async () => {
    const user = userEvent.setup();
    const march2024 = new Date(2024, 2, 1);

    render(
      <Calendar
        mode="range"
        month={march2024}
        selected={{ from: new Date(2024, 2, 10), to: new Date(2024, 2, 12) }}
      />,
    );

    const startDay = screen.getByRole("gridcell", { name: /10/i }).querySelector("button");
    const endDay = screen.getByRole("gridcell", { name: /12/i }).querySelector("button");

    // Verify data attributes defined in your CalendarDayButton
    expect(startDay).toHaveAttribute("data-range-start", "true");
    expect(endDay).toHaveAttribute("data-range-end", "true");
  });
});
