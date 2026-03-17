import {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { render, screen } from "@testing-library/react";
import { Table } from "lucide-react";

describe("Table components", () => {
  // TABLE CONTAINER
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

  // TABLE HEADER
  it("renders table header correctly", () => {
    render(<TableHeader data-testid="test-table-header">Sample Text</TableHeader>);
    const tableHeader = screen.getByTestId("test-table-header");
    expect(tableHeader).toHaveAttribute("data-slot", "table-header");
    expect(tableHeader).toBeInTheDocument();
  });

  it("applies table header with identifier name", () => {
    render(
      <TableHeader data-testid="test-table-header" id="my-id">
        Sample Text
      </TableHeader>,
    );
    const tableHeader = screen.getByTestId("test-table-header");
    expect(tableHeader).toHaveAttribute("id", "my-id");
    expect(tableHeader).toBeInTheDocument();
  });

  it("applies table header with custom class name", () => {
    render(
      <TableHeader data-testid="test-table-header" className="my-class">
        Sample Text
      </TableHeader>,
    );
    const tableHeader = screen.getByTestId("test-table-header");
    expect(tableHeader).toHaveClass("my-class");
    expect(tableHeader).toBeInTheDocument();
  });

  // TABLE BODY
  it("renders table body correctly", () => {
    render(<TableBody data-testid="test-table-body">Sample Text</TableBody>);
    const tableBody = screen.getByTestId("test-table-body");
    expect(tableBody).toHaveAttribute("data-slot", "table-body");
    expect(tableBody).toBeInTheDocument();
  });

  it("applies table body with identifier name", () => {
    render(
      <TableBody data-testid="test-table-body" id="my-id">
        Sample Text
      </TableBody>,
    );
    const tableBody = screen.getByTestId("test-table-body");
    expect(tableBody).toHaveAttribute("id", "my-id");
    expect(tableBody).toBeInTheDocument();
  });

  it("renders table body with custom class name", () => {
    render(
      <TableBody data-testid="test-table-body" className="my-class">
        Sample Text
      </TableBody>,
    );
    const tableBody = screen.getByTestId("test-table-body");
    expect(tableBody).toHaveClass("my-class");
  });

  // TABLE FOOTER
  it("renders table footer correctly", () => {
    render(<TableFooter data-testid="test-table-footer">Sample Text</TableFooter>);
    const tableFooter = screen.getByTestId("test-table-footer");
    expect(tableFooter).toHaveAttribute("data-slot", "table-footer");
    expect(tableFooter).toBeInTheDocument();
  });

  it("applies table footer with identifer name", () => {
    render(
      <TableFooter data-testid="test-table-footer" id="my-id">
        Sample Text
      </TableFooter>,
    );
    const tableFooter = screen.getByTestId("test-table-footer");
    expect(tableFooter).toHaveAttribute("id", "my-id");
    expect(tableFooter).toBeInTheDocument();
  });

  it("applies table footer with custom class name", () => {
    render(
      <TableFooter data-testid="test-table-footer" className="my-class">
        Sample Text
      </TableFooter>,
    );
    const tableFooter = screen.getByTestId("test-table-footer");
    expect(tableFooter).toHaveClass("my-class");
    expect(tableFooter).toBeInTheDocument();
  });

  // TABLE ROW
  it("renders table row correctly", () => {
    render(<TableRow data-testid="test-table-row">Sample Text</TableRow>);
    const tableRow = screen.getByTestId("test-table-row");
    expect(tableRow).toHaveAttribute("data-slot", "table-row");
  });

  it("applies table row with identifer name", () => {
    render(
      <TableRow data-testid="test-table-row" id="my-id">
        Sample Text
      </TableRow>,
    );
    const tableRow = screen.getByTestId("test-table-row");
    expect(tableRow).toHaveAttribute("id", "my-id");
    expect(tableRow).toBeInTheDocument();
  });

  it("applies table row with custom class name", () => {
    render(
      <TableRow data-testid="test-table-row" className="my-class">
        Sample Text
      </TableRow>,
    );
    const tableRow = screen.getByTestId("test-table-row");
    expect(tableRow).toHaveClass("my-class");
    expect(tableRow).toBeInTheDocument();
  });

  // TABLE HEAD
  it("renders table head correctly", () => {
    render(<TableHead data-testid="test-table-head">Sample Text</TableHead>);
    const tableHead = screen.getByTestId("test-table-head");
    expect(tableHead).toHaveAttribute("data-slot", "table-head");
  });

  it("applies table head with identifer name", () => {
    render(
      <TableHead data-testid="test-table-head" id="my-id">
        Sample Text
      </TableHead>,
    );
    const tableHead = screen.getByTestId("test-table-head");
    expect(tableHead).toHaveAttribute("id", "my-id");
    expect(tableHead).toBeInTheDocument();
  });

  it("applies table head with custom class name", () => {
    render(
      <TableHead data-testid="test-table-head" className="my-class">
        Sample Text
      </TableHead>,
    );
    const tableHead = screen.getByTestId("test-table-head");
    expect(tableHead).toHaveClass("my-class");
    expect(tableHead).toBeInTheDocument();
  });

  // TABLE CELL
  it("renders table cell correctly", () => {
    render(<TableCell data-testid="test-table-cell">Sample Text</TableCell>);
    const tableCell = screen.getByTestId("test-table-cell");
    expect(tableCell).toHaveAttribute("data-slot", "table-cell");
    expect(tableCell).toBeInTheDocument();
  });

  it("applies table cell with identifier name", () => {
    render(
      <TableCell data-testid="test-table-cell" id="my-id">
        Sample Text
      </TableCell>,
    );
    const tableCell = screen.getByTestId("test-table-cell");
    expect(tableCell).toHaveAttribute("id", "my-id");
    expect(tableCell).toBeInTheDocument();
  });

  it("applies table cell with custom class name", () => {
    render(
      <TableCell data-testid="test-table-cell" className="my-class">
        Sample Text
      </TableCell>,
    );
    const tableCell = screen.getByTestId("test-table-cell");
    expect(tableCell).toHaveClass("my-class");
    expect(tableCell).toBeInTheDocument();
  });

  // TABLE CAPTION
  it("renders table caption correctly", () => {
    render(<TableCaption data-testid="test-table-caption">Sample Text</TableCaption>);
    const tableCaption = screen.getByTestId("test-table-caption");
    expect(tableCaption).toHaveAttribute("data-slot", "table-caption");
    expect(tableCaption).toBeInTheDocument();
  });

  it("applies table caption with identifier name", () => {
    render(
      <TableCaption data-testid="test-table-caption" id="my-id">
        Sample Text
      </TableCaption>,
    );
    const tableCaption = screen.getByTestId("test-table-caption");
    expect(tableCaption).toHaveAttribute("id", "my-id");
    expect(tableCaption).toBeInTheDocument();
  });

  it("applies table caption with custom class name", () => {
    render(
      <TableCaption data-testid="test-table-caption" className="my-class">
        Sample Text
      </TableCaption>,
    );
    const tableCaption = screen.getByTestId("test-table-caption");
    expect(tableCaption).toHaveClass("my-class");
    expect(tableCaption).toBeInTheDocument();
  });
});
