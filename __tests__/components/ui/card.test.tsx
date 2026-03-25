import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { render, screen } from "@testing-library/react";

describe("Card components", () => {
  it("renders card correctly", () => {
    render(<Card>Sample Text</Card>);
    const card = screen.getByText(/sample text/i);
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toBeInTheDocument();
  });

  it("renders card header correctly", () => {
    render(<CardHeader>Sample Text</CardHeader>);
    const cardHeader = screen.getByText(/sample text/i);
    expect(cardHeader).toHaveAttribute("data-slot", "card-header");
    expect(cardHeader).toBeInTheDocument();
  });

  it("renders card title correctly", () => {
    render(<CardTitle>Sample Text</CardTitle>);
    const cardTitle = screen.getByText(/sample text/i);
    expect(cardTitle).toHaveAttribute("data-slot", "card-title");
    expect(cardTitle).toBeInTheDocument();
  });

  it("renders card description correctly", () => {
    render(<CardDescription>Sample Text</CardDescription>);
    const cardDescription = screen.getByText(/sample text/i);
    expect(cardDescription).toHaveAttribute("data-slot", "card-description");
    expect(cardDescription).toBeInTheDocument();
  });

  it("renders card action correctly", () => {
    render(<CardAction>Sample Text</CardAction>);
    const cardAction = screen.getByText(/sample text/i);
    expect(cardAction).toHaveAttribute("data-slot", "card-action");
    expect(cardAction).toBeInTheDocument();
  });

  it("renders card content correctly", () => {
    render(<CardContent>Sample Text</CardContent>);
    const cardContent = screen.getByText(/sample text/i);
    expect(cardContent).toHaveAttribute("data-slot", "card-content");
    expect(cardContent).toBeInTheDocument();
  });

  it("renders card footer correctly", () => {
    render(<CardFooter>Sample Text</CardFooter>);
    const cardFooter = screen.getByText(/sample text/i);
    expect(cardFooter).toHaveAttribute("data-slot", "card-footer");
    expect(cardFooter).toBeInTheDocument();
  });
});
