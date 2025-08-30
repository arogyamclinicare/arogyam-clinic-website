import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect, AccessibleButton } from '../AccessibleForm';

// Mock the useAccessibility hook
jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    associateError: jest.fn(),
    removeError: jest.fn(),
  }),
}));

describe('AccessibleInput', () => {
  it('should render with label', () => {
    render(<AccessibleInput label="Test Input" />);
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(<AccessibleInput label="Test Input" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<AccessibleInput label="Test Input" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should display helper text', () => {
    render(<AccessibleInput label="Test Input" helperText="Enter your name" />);
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<AccessibleInput label="Test Input" error="Error message" helperText="Helper text" />);
    const input = screen.getByLabelText('Test Input');
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});

describe('AccessibleTextarea', () => {
  it('should render with label', () => {
    render(<AccessibleTextarea label="Test Textarea" />);
    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(<AccessibleTextarea label="Test Textarea" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<AccessibleTextarea label="Test Textarea" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<AccessibleTextarea label="Test Textarea" />);
    const textarea = screen.getByLabelText('Test Textarea');
    
    expect(textarea).toHaveClass('block', 'w-full', 'px-3', 'py-2');
  });
});

describe('AccessibleSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render with label and options', () => {
    render(<AccessibleSelect label="Test Select" options={mockOptions} />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should show placeholder when provided', () => {
    render(<AccessibleSelect label="Test Select" options={mockOptions} placeholder="Choose an option" />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<AccessibleSelect label="Test Select" options={mockOptions} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should handle disabled options', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
    ];
    
    render(<AccessibleSelect label="Test Select" options={optionsWithDisabled} />);
    const select = screen.getByLabelText('Test Select');
    const option2 = screen.getByText('Option 2');
    
    expect(option2).toHaveAttribute('disabled');
  });
});

describe('AccessibleButton', () => {
  it('should render with children', () => {
    render(<AccessibleButton>Click me</AccessibleButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    render(<AccessibleButton variant="secondary">Secondary Button</AccessibleButton>);
    const button = screen.getByRole('button', { name: 'Secondary Button' });
    expect(button).toHaveClass('bg-gray-200', 'text-gray-900');
  });

  it('should apply size classes', () => {
    render(<AccessibleButton size="lg">Large Button</AccessibleButton>);
    const button = screen.getByRole('button', { name: 'Large Button' });
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('should show loading state', () => {
    render(<AccessibleButton loading loadingText="Loading...">Button</AccessibleButton>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('should be disabled when loading', () => {
    render(<AccessibleButton loading>Button</AccessibleButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should handle disabled state', () => {
    render(<AccessibleButton disabled>Disabled Button</AccessibleButton>);
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<AccessibleButton onClick={handleClick}>Clickable Button</AccessibleButton>);
    
    const button = screen.getByRole('button', { name: 'Clickable Button' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
