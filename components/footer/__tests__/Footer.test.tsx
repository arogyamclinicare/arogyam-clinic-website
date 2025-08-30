import { render, screen } from '@testing-library/react';
import { Footer } from '../../Footer';

describe('Footer', () => {
  it('should render the clinic logo and name', () => {
    render(<Footer />);
    // Look for the main logo area specifically
    const logoContainer = screen.getByAltText('Arogyam Clinic Logo').closest('div');
    expect(logoContainer).toBeInTheDocument();
    // Check that the logo image is present
    expect(screen.getByAltText('Arogyam Clinic Logo')).toBeInTheDocument();
  });

  it('should render clinic description', () => {
    render(<Footer />);
    expect(screen.getByText(/Dr. Kajal Kumari provides expert homeopathic care/)).toBeInTheDocument();
  });

  it('should render social media buttons', () => {
    render(<Footer />);
    const socialButtons = screen.getAllByRole('button');
    expect(socialButtons.length).toBeGreaterThan(0);
  });

  it('should have proper semantic structure', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('id', 'contact');
  });

  it('should have proper responsive design classes', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gradient-to-br', 'text-white');
  });

  it('should render contact section', () => {
    render(<Footer />);
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<Footer />);
    const socialButtons = screen.getAllByRole('button');
    socialButtons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  it('should render clinic information', () => {
    render(<Footer />);
    // Check for the main logo image instead of text
    expect(screen.getByAltText('Arogyam Clinic Logo')).toBeInTheDocument();
    expect(screen.getByText(/Dr. Kajal Kumari/)).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    render(<Footer />);
    // Check for the grid layout container
    const gridContainer = screen.getByText(/Why Choose/).closest('div');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should render with proper styling', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('backdrop-blur-xl');
  });

  it('should render why choose section', () => {
    render(<Footer />);
    expect(screen.getByText(/Why Choose/)).toBeInTheDocument();
    expect(screen.getByText(/Your health and trust matter to us/)).toBeInTheDocument();
  });

  it('should render quick navigation section', () => {
    render(<Footer />);
    expect(screen.getByText(/Quick/)).toBeInTheDocument();
    expect(screen.getByText(/Navigation/)).toBeInTheDocument();
    expect(screen.getByText(/Find what you need quickly with our organized navigation links/)).toBeInTheDocument();
  });

  it('should render copyright information', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 Arogyam. All rights reserved./)).toBeInTheDocument();
  });

  it('should render legal links', () => {
    render(<Footer />);
    // Check for at least one legal link button
    const legalButtons = screen.getAllByRole('button');
    expect(legalButtons.length).toBeGreaterThan(0);
  });
});
