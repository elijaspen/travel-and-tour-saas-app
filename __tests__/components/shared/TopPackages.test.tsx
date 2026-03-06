import { render, screen } from '@testing-library/react'
import { TopPackages, TourPackage } from '@/components/shared/TopPackages'

const mockPackages: TourPackage[] = [
    { id: "t1", name: "Ubud Cultural Trek", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=80", salesCount: 42, salesChange: 12 },
    { id: "t2", name: "Kyoto Tea Ceremony", imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=120&q=80", salesCount: 28, salesChange: 5 },
    { id: "t3", name: "Northern Lights", imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=120&q=80", salesCount: 15, salesChange: -2 },
    { id: "t4", name: "Safari Adventure", imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=120&q=80", salesCount: 12, salesChange: 8 },
]

describe("TopPackages Component", () => {
    it("renders the title", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByText("Top Packages")).toBeInTheDocument()
    })

    it("renders the description", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByText("Best selling tours this month")).toBeInTheDocument()
    })

    it("renders package names", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByText("Ubud Cultural Trek")).toBeInTheDocument()
        expect(screen.getByText("Kyoto Tea Ceremony")).toBeInTheDocument()
        expect(screen.getByText("Northern Lights")).toBeInTheDocument()
        expect(screen.getByText("Safari Adventure")).toBeInTheDocument()
    })

    it("renders sales count", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByText("42 sales")).toBeInTheDocument()
        expect(screen.getByText("28 sales")).toBeInTheDocument()
        expect(screen.getByText("15 sales")).toBeInTheDocument()
        expect(screen.getByText("12 sales")).toBeInTheDocument()
    })

    it("renders positive sales change", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByText("+12%")).toBeInTheDocument()
        expect(screen.getByText("+5%")).toBeInTheDocument()
        expect(screen.getByText("+8%")).toBeInTheDocument()
    })

    it("renders negative sales change", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByText("-2%")).toBeInTheDocument()
    })

    it("renders View All Packages button", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByRole("button", { name: "View All Packages" })).toBeInTheDocument()
    })

    it("renders images with correct alt text", () => {
        render(<TopPackages packages={mockPackages} />)
        expect(screen.getByAltText("Ubud Cultural Trek")).toBeInTheDocument()
        expect(screen.getByAltText("Kyoto Tea Ceremony")).toBeInTheDocument()
        expect(screen.getByAltText("Northern Lights")).toBeInTheDocument()
        expect(screen.getByAltText("Safari Adventure")).toBeInTheDocument()
    })
})
