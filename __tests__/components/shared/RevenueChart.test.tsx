import { render, screen } from '@testing-library/react'
import { RevenueChart } from '@/components/shared/RevenueChart'

const mockData = [
    {month: "Jan", amount: 8400},
    {month: "Feb", amount: 9200},
    { month: "Mar", amount: 11000 },
    { month: "Apr", amount: 10500 },
    { month: "May", amount: 9800  },
    { month: "Jun", amount: 14200 },
    { month: "Jul", amount: 12800 },
]

describe("Revenue Chart", () => {
    it("renders title", () => {
        render(<RevenueChart data={mockData} />)
        expect(screen.getByText("Revenue Overview")).toBeInTheDocument()
    })

    it("renders description", () => {
        render(<RevenueChart data={mockData} />)
        expect(screen.getByText("Monthly performance comparison")).toBeInTheDocument()
    })

    it("renders month labels", () => {
        render(<RevenueChart data={mockData} />)
        mockData.forEach((data) => {
            expect(screen.getByText(data.month)).toBeInTheDocument()
        })
    })

    it("renders SVG chart", () => {
        render(<RevenueChart data={mockData} />)
        expect(screen.getByLabelText(/monthly revenue bar chart/i)).toBeInTheDocument()
    })
})

