import { render, screen } from '@testing-library/react'
import { StatsCard } from '@/components/shared/StatsCard'
import { BarChart2, Package, Star } from 'lucide-react'

describe("StatsCard Component", () => {
    it("renders the title", () => {
        render(<StatsCard title="Total Revenue" value="$124,500" change={12} subtitle="vs last month" icon={BarChart2} />)
        expect(screen.getByText("Total Revenue")).toBeInTheDocument()
    })

    it("renders the value", () => {
        render(<StatsCard title="Total Revenue" value="$124,500" change={12} subtitle="vs last month" icon={BarChart2} />)
        expect(screen.getByText("$124,500")).toBeInTheDocument()
    })

    it("renders positive change with plus sign", () => {
        render(<StatsCard title="Total Revenue" value="$124,500" change={12} subtitle="vs last month" icon={BarChart2} />)
        expect(screen.getByText("+12%")).toBeInTheDocument()
    })

    it("renders negative change without plus sign", () => {
        render(<StatsCard title="Packages Sold" value="312" change={-5} subtitle="This month" icon={Package} />)
        expect(screen.getByText("-5%")).toBeInTheDocument()
    })

    it("renders subtitle", () => {
        render(<StatsCard title="Total Revenue" value="$124,500" change={12} subtitle="vs last month" icon={BarChart2} />)
        expect(screen.getByText("vs last month")).toBeInTheDocument()
    })

    it("renders with different icon", () => {
        render(<StatsCard title="Avg. Rating" value="4.9" change={3} subtitle="Customer satisfaction" icon={Star} />)
        expect(screen.getByText("Avg. Rating")).toBeInTheDocument()
        expect(screen.getByText("4.9")).toBeInTheDocument()
    })
})
