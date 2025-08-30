import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { OptimizedConsultationProvider } from '../context/OptimizedConsultationContext';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    signOut: jest.fn(),
  }),
}));

// Helper function to render Header with required context
const renderHeader = () => {
  return render(
    <OptimizedConsultationProvider>
      <Header />
    </OptimizedConsultationProvider>
  );
};

describe('Header', () => {
  it('should render the clinic logo and name', () => {
    renderHeader();
    expect(screen.getByText('Arogyam')).toBeInTheDocument();
    // Note: Header only shows "Arogyam", not "Homeopathic Clinic"
  });

  it('should render navigation menu items', () => {
    renderHeader();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Treatments')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render patient portal button', () => {
    renderHeader();
    expect(screen.getByText('Patient Portal')).toBeInTheDocument();
  });

  it('should render consultation booking button', () => {
    renderHeader();
    expect(screen.getByText('Book Consultation')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderHeader();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should have proper responsive classes', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render FAQs navigation item', () => {
    renderHeader();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
  });

  it('should have mobile menu toggle button', () => {
    renderHeader();
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });
});
