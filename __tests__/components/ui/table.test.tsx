import { TableHeader } from "@/components/ui/table";
import { render, screen } from "@testing-library/react";
import { Table } from "lucide-react";

describe("Table components", () => {
  it("renders table container correctly", () => {
    render(<Table data-testid="test-table">Sample Text</Table>);
    const tableContainer = screen.getByTestId("test-table");
    expect(tableContainer).toBeInTheDocument();
  });

  it("applies with identifier name", () => {
    render(
      <Table data-testid="test-table" id="my-id">
        Sample Text
      </Table>,
    );
    const tableContainer = screen.getByTestId("test-table");
    expect(tableContainer).toHaveAttribute("id", "my-id");
    expect(tableContainer).toBeInTheDocument();
  });

  it("applies with custom class name", () => {
    render(
      <Table data-testid="test-table" className="my-class">
        Sample Text
      </Table>,
    );
    const tableContainer = screen.getByTestId("test-table");
    expect(tableContainer).toHaveClass("my-class");
    expect(tableContainer).toBeInTheDocument();
  });
});
