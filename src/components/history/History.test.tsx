import History from './History';
import messages from '../../messages/en.json';
import { NextIntlClientProvider } from 'next-intl';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    user: {},
    name: 'John',
  }),
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

beforeEach(() => {
  localStorage.setItem(
    'history-requests',
    JSON.stringify([{ metod: 'GET', url: '/test-url', requestDate: new Date().toISOString() }]),
  );
});

describe('History', () => {
  it('should render history page', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <History />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText(`History Requests`)).toBeInTheDocument();
    expect(screen.getByText('GET /test-url')).toBeInTheDocument();

    const btn = screen.getByText('Clear history');

    fireEvent.click(btn);

    expect(screen.getByText(`History Requests`)).toBeInTheDocument();
    expect(screen.getByText(`You haven't executed any requests. It's empty here. Try:`)).toBeInTheDocument();
    expect(screen.getByText('Rest-client')).toBeInTheDocument();
  });
});
