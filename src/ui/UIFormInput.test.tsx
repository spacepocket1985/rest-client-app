import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UIFormInput } from './UIFormInput';
import { useForm } from 'react-hook-form';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('UIFormInput Component', () => {
  const TestWrapper = ({
    type = 'text',
    showPasswordToggle = true,
    error,
  }: {
    type?: string;
    showPasswordToggle?: boolean;
    error?: string;
  }) => {
    const { register } = useForm();

    return (
      <UIFormInput
        type={type}
        name="testInput"
        register={register}
        required
        placeholder="Enter text"
        error={error}
        showPasswordToggle={showPasswordToggle}
      />
    );
  };

  it('renders input with provided placeholder', () => {
    render(<TestWrapper />);
    const input = screen.getByPlaceholderText('Enter text');

    expect(input).toBeInTheDocument();
  });

  it('renders password input and toggles visibility', () => {
    render(
      <TestWrapper
        type="password"
        showPasswordToggle
      />,
    );

    const input = screen.getByPlaceholderText('Enter text');

    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
  });

  it('does not render password toggle button when showPasswordToggle is false', () => {
    render(
      <TestWrapper
        type="password"
        showPasswordToggle={false}
      />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(<TestWrapper error="required" />);
    expect(screen.getByText('required')).toBeInTheDocument();
  });

  it('applies correct styles when error is present', () => {
    render(<TestWrapper error="errorText" />);
    const input = screen.getByPlaceholderText('Enter text');

    expect(input).toHaveClass('border-red-500');
  });
  it('renders correct input type when type is not password', () => {
    render(<TestWrapper type="email" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'email');
  });
});
