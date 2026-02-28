import { render, screen } from "@testing-library/react";
import FeaturedTours from "@/components/shared/FeaturedTours";

describe("FeaturedTours Component", () => {
  it("renders the section heading", () => {
    render(<FeaturedTours />);
    expect(
      screen.getByRole("heading", { name: /Featured Tours/i })
    ).toBeInTheDocument();
  });

  it("renders the specific tour cards", () => {
    render(<FeaturedTours />);
    expect(screen.getByText("Kyoto Traditional Tea Ceremony")).toBeInTheDocument();
    expect(screen.getByText("Safari Adventure in Serengeti")).toBeInTheDocument();
    expect(screen.getByText("Northern Lights in Iceland")).toBeInTheDocument();
  });

  it("renders the View All Tours button", () => {
    render(<FeaturedTours />);
    expect(screen.getByRole("button", { name: /View All Tours/i })).toBeInTheDocument();
  });
});