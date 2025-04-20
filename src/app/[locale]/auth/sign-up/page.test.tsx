import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';
import * as firebase from '@utils/firebase';
import SignUpPage from './page';

const mockPush = vi.fn();

vi.mock('@utils/firebase', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(typeof actual === 'object' ? actual : {}),
    logInWithEmailAndPassword: vi.fn(),
    onError: vi.fn(),
  };
});

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
      <SignUpPage />
    </NextIntlClientProvider>,
  );
};

describe('SignUpPage', () => {
  it('should render sign-up page', async () => {
    renderPage();

    await waitFor(() => {
      const registerLink = screen.getByText(/Sign In/i);

      expect(registerLink).toBeInTheDocument();
    });

    expect(screen.getByText(/Do you already have an account?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });

  it('displays error messages if input fields are invalid', async () => {
    renderPage();

    const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'TestMan' } });
    fireEvent.change(emailInput, {
      target: { value: 'invalidMailexample.com' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'BadPassword' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'BadPassword1' },
    });

    await waitFor(() => {
      expect(screen.getByText(/Confirm Password does not match./i)).toBeInTheDocument();
      expect(screen.getByText(/Password must contain at least one digit./i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email./i)).toBeInTheDocument();
    });
  });

  it('should call registerWithEmailAndPassword when form is submitted', async () => {
    renderPage();

    const spy = vi.spyOn(firebase, 'registerWithEmailAndPassword');

    const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;

    await waitFor(() => {
      fireEvent.change(nameInput, { target: { value: 'User' } });
      fireEvent.change(emailInput, { target: { value: 'testMail@test.com' } });
      fireEvent.change(passwordInput, { target: { value: '123testMail@test.com' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: '123testMail@test.com' },
      });
    });

    act(() => {
      const submitBtn = screen.getByTestId('submitBtn');

      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('User', 'testMail@test.com', '123testMail@test.com');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
