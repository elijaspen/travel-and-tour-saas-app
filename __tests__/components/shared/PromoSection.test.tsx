import {screen, render} from "@testing-library/react";
import PromoSection from "@/components/shared/PromoSection";

describe("PromoSection Component", () => {
    it("renders the value proposition", () => {
        render(<PromoSection />)

        expect(screen.getByText(/Secure Booking/i)).toBeInTheDocument();
        expect(screen.getByText(/Global Support/i)).toBeInTheDocument();
        expect(screen.getByText(/Best Quality/i)).toBeInTheDocument();
    });

    it("it renders the newsletter email input", () => {
        render(<PromoSection />)

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });

    it("it renders the Subscribe button", () => {
        render(<PromoSection/>)

        expect(screen.getByRole("button", { name: /Subscribe/i} )).toBeInTheDocument();
    })
});