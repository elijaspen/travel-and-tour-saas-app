import { render, screen } from '@testing-library/react';
import { AppSidebar } from '@/components/shared/AppSidebar'

describe("AppSidebar components", () => {
    it("renders the sidebar brand", () => {
        render(<AppSidebar />);
        expect(screen.getByText("Travel and Tour")).toBeInTheDocument();
    });

    it("renders agent profile", () => {
        render(<AppSidebar />);
        expect(screen.getByAltText("Agent Profile")).toBeInTheDocument();
        expect(screen.getByText("Eli Jaspen")).toBeInTheDocument();
        expect(screen.getByText("Premier Agent")).toBeInTheDocument();
    })

    it("renders the sidebar nav items", () => {
        render(<AppSidebar />);
        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.getByText("Packages")).toBeInTheDocument();
        expect(screen.getByText("Bookings")).toBeInTheDocument();
        expect(screen.getByText("Promos")).toBeInTheDocument();
        expect(screen.getByText("Customers")).toBeInTheDocument();
        expect(screen.getByText("Analytics")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders the logout button in footer", () => {
        render(<AppSidebar />);
        expect(screen.getByRole("button", { name: "Log Out" })).toBeInTheDocument();
    });
});
