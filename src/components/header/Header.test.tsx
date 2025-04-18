import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { NextIntlClientProvider } from 'next-intl';
import mockRouter from 'next-router-mock';
import Header from './Header';
import messages from '../../messages/en.json';

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      push: mockRouter.push,
      replace: mockRouter.replace,
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

const renderHeader = (locale = 'en') => {
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <Header />
    </NextIntlClientProvider>,
    { wrapper: MemoryRouterProvider },
  );
};

describe('Header Component Tests', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mock('@context/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: false,
      }),
    }));
  });
  it('should display Sign in and Sign up buttons', async () => {
    await act(async () => {
      renderHeader();
    });
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/REST Client/i)).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Sign up/i));
      expect(mockRouter).toMatchObject({
        pathname: '/en/auth/sign-up',
      });
    });
  });
  it('should add scrolled class when window is scrolled', () => {
    renderHeader();
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    const header = screen.getByRole('banner');

    expect(header).toHaveClass('bg-gray-400');
    expect(header).toHaveClass('shadow-md');
  });
});
