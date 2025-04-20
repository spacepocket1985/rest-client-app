import { render, screen } from '@testing-library/react';
import WelcomePage from './page';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@components/welcome/Welcome', () => ({
  default: vi.fn(() => <div>Mocked Welcome Component</div>),
}));

describe('WelcomePage', () => {
  it('should render Welcome component', () => {
    render(<WelcomePage />);
    expect(screen.getByText('Mocked Welcome Component')).toBeInTheDocument();
  });
});
