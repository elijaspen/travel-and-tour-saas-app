import React from 'react'
import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/(dashboard)/agent/page'

describe('Agent Dashboard Page', () => {
  it('renders the dashboard with breadcrumb navigation', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<DashboardPage />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('renders all KPI stats cards', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$124,500')).toBeInTheDocument()
    expect(screen.getByText('Active Bookings')).toBeInTheDocument()
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.getByText('Packages Sold')).toBeInTheDocument()
    expect(screen.getByText('312')).toBeInTheDocument()
    expect(screen.getByText('Avg. Rating')).toBeInTheDocument()
    expect(screen.getByText('4.9')).toBeInTheDocument()
  })

  it('renders active promotions section', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Active Promotions')).toBeInTheDocument()
    expect(screen.getByText('SUMMER2024')).toBeInTheDocument()
    expect(screen.getByText('BALIBLISS')).toBeInTheDocument()
  })

  it('renders recent bookings table', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Recent Bookings')).toBeInTheDocument()
    expect(screen.getByText('Alice Freeman')).toBeInTheDocument()
    expect(screen.getByText('Bali Jungle Trek')).toBeInTheDocument()
  })

  it('renders top packages section', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Top Packages')).toBeInTheDocument()
    expect(screen.getByText('Ubud Cultural Trek')).toBeInTheDocument()
  })
})
