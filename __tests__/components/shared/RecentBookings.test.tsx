import {render, screen } from '@testing-library/react'
import { RecentBookings, Booking } from '@/components/shared/RecentBookings'


const mockBookings: Booking[] = [
    {id: "1", customerName: "Alice Freeman", packageName: "Bali Jungle Trek", dateRange: "Oct 12-19", status:"Confirmed", amount: 450 },
    {id: "2", customerName: "Mark Taylor", packageName: "Komodo Island", dateRange: "Nov 02-05", status:"Pending", amount: 1250 },
    {id: "3", customerName: "Sophie Wu", packageName: "Tokyo City Tour", dateRange: "Dec 10-15", status:"Confirmed", amount: 850 },
    {id: "4", customerName: "James Miller", packageName: "Iceland Northern Lights", dateRange: "Jan 05-10", status:"Cancelled", amount: 1899 },
    {id: "5", customerName: "Emma Wilson", packageName: "Paris Romantic Gateway", dateRange: "Feb 14-18", status:"Confirmed", amount: 2100 },
]

describe("RecentBookings component", () => {
    it("renders the recent bookings header", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByText("Recent Bookings")).toBeInTheDocument();
    });

    it("renders description 'Latest customer reservations'", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByText("Latest customer reservations")).toBeInTheDocument();
    });

    it("renders the 'View all' button", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByRole("button", { name: "View All" })).toBeInTheDocument();
    })

    it("renders the recent bookings table headers", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByRole("columnheader", { name: "Customer" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Package" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Date" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument();
    })

    it("renders customer name", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByText("Mark Taylor")).toBeInTheDocument();
        expect(screen.getByText("Sophie Wu")).toBeInTheDocument();
        expect(screen.getByText("James Miller")).toBeInTheDocument();
        expect(screen.getByText("Emma Wilson")).toBeInTheDocument();
        expect(screen.getByText("Alice Freeman")).toBeInTheDocument();
    })

    it("renders package names", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByText("Bali Jungle Trek")).toBeInTheDocument();
        expect(screen.getByText("Komodo Island")).toBeInTheDocument();
        expect(screen.getByText("Tokyo City Tour")).toBeInTheDocument();
        expect(screen.getByText("Iceland Northern Lights")).toBeInTheDocument();
        expect(screen.getByText("Paris Romantic Gateway")).toBeInTheDocument();
    })

    it("renders date range", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByText("Oct 12-19")).toBeInTheDocument();
        expect(screen.getByText("Nov 02-05")).toBeInTheDocument();
        expect(screen.getByText("Dec 10-15")).toBeInTheDocument();
        expect(screen.getByText("Jan 05-10")).toBeInTheDocument();
        expect(screen.getByText("Feb 14-18")).toBeInTheDocument();
    })

    it("renders status", () => {
        render(<RecentBookings bookings={mockBookings} />)
        const confirmedStatuses = screen.getAllByText("Confirmed")
        expect(confirmedStatuses.length).toBeGreaterThan(0)
        expect(screen.getByText("Pending")).toBeInTheDocument();
        expect(screen.getByText("Cancelled")).toBeInTheDocument();
    })

    it("renders formatted amount", () => {
        render(<RecentBookings bookings={mockBookings} />)
        expect(screen.getByText("$450")).toBeInTheDocument();
        expect(screen.getByText("$1,250")).toBeInTheDocument();
        expect(screen.getByText("$850")).toBeInTheDocument();
        expect(screen.getByText("$1,899")).toBeInTheDocument();
        expect(screen.getByText("$2,100")).toBeInTheDocument();
    })
});