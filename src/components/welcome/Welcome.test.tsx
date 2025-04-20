import Welcome from './Welcome';
import messages from '../../messages/en.json';
import { NextIntlClientProvider } from 'next-intl';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAuth } from '@context/AuthContext';
import { User } from 'firebase/auth';

vi.mock('@context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Welcome', () => {
  const mockUseAuth = vi.mocked(useAuth);

  const renderWelcome = (authValue: ReturnType<typeof useAuth>) => {
    mockUseAuth.mockReturnValue(authValue);

    return render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <Welcome />
      </NextIntlClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render welcome page with user name when authenticated', () => {
    renderWelcome({
      user: { uid: '123' } as User,
      name: 'John',
      loading: false,
      isLoading: false,
    });

    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This application is a lightweight platform for using and building APIs. It supports method selection, URL inputs, and headers. It was created by a team of students during the React course at RS School. Try it out!',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(`Oleksandr Mazghin`)).toBeInTheDocument();
    expect(screen.getByText(`Mykhailo Nikolaiev`)).toBeInTheDocument();
    expect(screen.getByText(`Aliaksandr Klintsevich`)).toBeInTheDocument();
    expect(screen.getByText(`Variables`)).toBeInTheDocument();
    expect(screen.getByText(`Rest-client`)).toBeInTheDocument();
    expect(screen.getByText(`History`)).toBeInTheDocument();
  });

  it('should render welcome page without user name when not authenticated', () => {
    renderWelcome({
      user: null,
      name: null,
      loading: false,
      isLoading: false,
    });

    expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'This application is a lightweight platform for using and building APIs. It supports method selection, URL inputs, and headers. It was created by a team of students during the React course at RS School. Try it out!',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(`Sign in`)).toBeInTheDocument();
    expect(screen.getByText(`Sign up`)).toBeInTheDocument();
  });
});
