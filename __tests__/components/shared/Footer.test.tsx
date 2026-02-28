import { render, screen } from "@testing-library/react";
import Footer from "@/components/shared/Footer";

describe("Footer Component", () => {
  it("renders the company brand name", () => {
    render(<Footer />);
 
    expect(screen.getAllByText(/Travel and Tour/i)[0]).toBeInTheDocument();
  });

  it("renders the footer link columns", () => {
    render(<Footer />);

    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Help Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Become a Partner/i)).toBeInTheDocument();
  });

  it("renders the copyright notice", () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 Travel and Tour Inc./i)).toBeInTheDocument();
  });
});