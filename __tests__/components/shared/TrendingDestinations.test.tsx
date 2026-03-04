import { render, screen } from "@testing-library/react";
import TrendingDestinations from "@/components/shared/TrendingDestinations";

describe("TrendingDestinations Component", () => {
  it("renders the section heading", () => {
    render(<TrendingDestinations />);
    
    expect(
      screen.getByRole("heading", { name: /Trending Destinations/i })
    ).toBeInTheDocument();
  });

  it("renders the destination cards", () => {
    render(<TrendingDestinations />);
    
    expect(screen.getByText("Paris, France")).toBeInTheDocument();
    expect(screen.getByText("Tokyo, Japan")).toBeInTheDocument();
    expect(screen.getByText("Bali, Indonesia")).toBeInTheDocument();
  });
});