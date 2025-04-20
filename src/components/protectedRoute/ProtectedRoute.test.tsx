import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

let mockUserValue: { id: string; name: string } | null = null;

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: mockUserValue }),
}));

vi.mock('../spinner/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

vi.mock('@constants/routePaths', () => ({
  RoutePaths: { WELCOME: '/welcome' },
}));

import ProtectedRoute, { AuthRequirement } from './ProtectedRoute';

const DummyComponent = () => <div data-testid="protected">Protected Content</div>;

const ProtectedWithAuth = ProtectedRoute(DummyComponent, AuthRequirement.WithAuth);
const ProtectedWithoutAuth = ProtectedRoute(DummyComponent, AuthRequirement.WithoutAuth);

describe('ProtectedRoute HOC', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wrapped component when user is present and requirement is WithAuth', async () => {
    mockUserValue = { id: '123', name: 'Alex' };
    render(<ProtectedWithAuth />);

    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
  });

  it('renders wrapped component when user is absent and requirement is WithoutAuth', async () => {
    mockUserValue = null;
    render(<ProtectedWithoutAuth />);

    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
  });

  it('redirects to welcome and shows spinner when user present but requirement is WithoutAuth', async () => {
    mockUserValue = { id: '123', name: 'Alex' };
    render(<ProtectedWithoutAuth />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/welcome');
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('redirects to welcome and shows spinner when user absent but requirement is WithAuth', async () => {
    mockUserValue = null;
    render(<ProtectedWithAuth />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/welcome');
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
