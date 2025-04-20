import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UILink } from './UILink';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../messages/en.json';

describe('UILink Component', () => {
  it('renders the link with provided href', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <UILink href="/test">Click me</UILink>
      </NextIntlClientProvider>,
    );
    const link = screen.getByRole('link', { name: 'Click me' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/test');
  });

  it('applies disabled styles and prevents click when disabled', () => {
    const mockClick = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <UILink
          href="/disabled"
          disabled
          onClick={mockClick}
          text="Disabled Link"
        />
      </NextIntlClientProvider>,
    );

    const link = screen.getByRole('link', { name: 'Disabled Link' });

    expect(link).toHaveClass('bg-slate-300 select-none pointer-events-none');
    expect(link).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(link);
    expect(mockClick).not.toHaveBeenCalled();
  });
});
