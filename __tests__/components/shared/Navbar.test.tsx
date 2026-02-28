import {render, screen } from "@testing-library/react";
import Navbar from "@/components/shared/Navbar";

describe ("Navbar Component", () => {
    it("renders the Travel and Tours Logo", () => {
        render(<Navbar />);
    expect(screen.getByText("Travel and Tour")).toBeInTheDocument();
    });

    it("renders the main navigation links", () => {
        render(<Navbar />);
        expect(screen.getByText("Destinations")).toBeInTheDocument();
        expect(screen.getByText("Tours")).toBeInTheDocument();
        expect(screen.getByText("Flights")).toBeInTheDocument();
        expect(screen.getByText("Deals")).toBeInTheDocument();
        expect(screen.getByText("Support")).toBeInTheDocument();

    });

    it("renders the authentication actions", () => {
        render(<Navbar />);
        expect(screen.getByText("Log in")).toBeInTheDocument();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });
});


