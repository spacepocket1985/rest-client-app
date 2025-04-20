import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UIHeader } from './UIHeader';

describe('UIHeader Component', () => {
  it('renders with default styling when no className is provided', () => {
    render(<UIHeader text="Default Header" />);
    const header = screen.getByRole('heading', { name: 'Default Header' });

    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      'font-semibold mb-2 py-2 px-10 text-white bg-purple-800 rounded-md inline-block text-center',
    );
  });

  it('applies custom className when provided', () => {
    render(
      <UIHeader
        text="Custom Header"
        className="custom-class"
      />,
    );
    const header = screen.getByRole('heading', { name: 'Custom Header' });

    expect(header).toHaveClass('custom-class');
  });
});
