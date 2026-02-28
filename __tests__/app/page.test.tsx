import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Homepage", () => {
  it("renders the main hero headline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /Discover Your Next Adventure/i })
    ).toBeInTheDocument();
  });

  it("renders the search bar inputs", () => {
    render(<Home />);
    expect(screen.getByPlaceholderText("Search destinations")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add dates")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add guests")).toBeInTheDocument();
  });

  it("renders the main search button", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });
});