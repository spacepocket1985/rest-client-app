import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, act, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';
import SignInPage from './page';
import * as firebase from '@utils/firebase';

const mockPush = vi.fn();
const spy = vi.spyOn(firebase, 'logInWithEmailAndPassword');

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

const renderPage = (locale = 'en') => {
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <SignInPage />
    </NextIntlClientProvider>,
  );
};

describe('SignInPage', () => {
  it('should render sign-in page', async () => {
    renderPage();

    await waitFor(() => {
      const registerLink = screen.getByText(/Register/i);

      expect(registerLink).toBeInTheDocument();
    });

    expect(screen.getByText(/Don’t have an account?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should enable submit button when form is valid', async () => {
    renderPage();

    await waitFor(() => {
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('Email'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
          target: { value: 'password123' },
        });
      });
    });

    act(() => {
      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons[1];

      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
