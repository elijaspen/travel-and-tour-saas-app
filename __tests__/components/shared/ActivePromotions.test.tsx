import { render, screen } from '@testing-library/react'
import { ActivePromotions } from '@/components/shared/ActivePromotions'

const mockPromos = [
    {id: "p1", code: "SUMMER2024", description: "20% Off", isActive: true},
    {id: "p2", code: "BALIBLISS", description: "$50 Off", isActive: true},
    {id: "p3", code: "EARLYBIRD", description: "15% Off", isActive: false},
    {id: "p4", code: "FAMILYFUN", description: "10% Off", isActive:false},
]

describe('ActivePromotions Component', () => {
    it('renders the active promotions', () => {
        render(<ActivePromotions promos={mockPromos} />)
        expect(screen.getByText('Active Promotions')).toBeInTheDocument()
        expect(screen.getByText('SUMMER2024')).toBeInTheDocument()
        expect(screen.getByText('BALIBLISS')).toBeInTheDocument()
        expect(screen.queryByText('EARLYBIRD')).toBeInTheDocument()
        expect(screen.queryByText('FAMILYFUN')).toBeInTheDocument()
    });
});
