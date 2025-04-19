import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { NextIntlClientProvider } from 'next-intl';
import mockRouter from 'next-router-mock';
import Header from './Header';
import messages from '../../messages/en.json';
import { User } from 'firebase/auth';
import { useAuth } from '@context/AuthContext';

vi.mock('@utils/firebase', () => ({
  logout: vi.fn(),
}));

vi.mock('@context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

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
const mockUseAuth = vi.mocked(useAuth);
const renderHeader = (locale = 'en', authValue: ReturnType<typeof useAuth>) => {
  mockUseAuth.mockReturnValue(authValue);

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
    vi.clearAllMocks();
  });

  describe('When user is not authenticated', () => {
    it('should display Sign in and Sign up buttons', async () => {
      await act(async () => {
        renderHeader('en', {
          user: null,
          loading: false,
          isLoading: false,
          name: null,
        });
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
  });

  describe('When user is authenticated', () => {
    it('should display Logout and Home buttons', async () => {
      await act(async () => {
        renderHeader('en', {
          user: { uid: '123' } as User,
          loading: false,
          isLoading: false,
          name: 'John',
        });
      });

      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
      expect(screen.getByText(/REST Client/i)).toBeInTheDocument();
      expect(screen.queryByText(/Sign in/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Sign up/i)).not.toBeInTheDocument();
    });

    it('should call logout when Logout button is clicked', async () => {
      const { logout } = await import('@utils/firebase');

      await act(async () => {
        renderHeader('en', {
          user: { uid: '123' } as User,
          loading: false,
          isLoading: false,
          name: 'John',
        });
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText(/Logout/i));
        expect(logout).toHaveBeenCalled();
      });
    });
  });

  it('should add scrolled class when window is scrolled', () => {
    renderHeader('en', {
      user: null,
      loading: false,
      isLoading: false,
      name: null,
    });

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    const header = screen.getByRole('banner');

    expect(header).toHaveClass('bg-gray-400');
    expect(header).toHaveClass('shadow-md');
  });
});
