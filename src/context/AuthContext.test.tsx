import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import type { Mock } from 'vitest';

const fakePush = vi.fn();

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(() => [null, false]),
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      push: fakePush,
    }),
  };
});

vi.mock('@utils/firebase', () => ({
  auth: {},
  fetchUserName: vi.fn(() => Promise.resolve('John')),
  logout: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = () => {
  const { user, name, isLoading } = useAuth();

  return (
    <div>
      <span>user:{user ? 'yes' : 'no'}</span>
      <span>name:{name}</span>
      <span>isLoading:{isLoading ? 'yes' : 'no'}</span>
    </div>
  );
};

describe('AuthProvider', () => {
  it('provides null user when unauthenticated', async () => {
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByText('user:no')).toBeInTheDocument();
      expect(getByText('name:')).toBeInTheDocument();
      expect(getByText('isLoading:no')).toBeInTheDocument();
    });
  });

  it('provides authenticated user details and fetches name', async () => {
    const fakeUser = {
      getIdToken: () => Promise.resolve('valid-token'),
    };

    const { useAuthState } = await import('react-firebase-hooks/auth');

    (useAuthState as Mock).mockReturnValue([fakeUser, false]);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByText('user:yes')).toBeInTheDocument();
      expect(getByText('name:John')).toBeInTheDocument();
      expect(getByText('isLoading:no')).toBeInTheDocument();
    });
  });

  it('redirects and logs out when token is invalid', async () => {
    const fakeUser = {
      getIdToken: () => Promise.resolve(''),
    };

    const { useAuthState } = await import('react-firebase-hooks/auth');

    (useAuthState as Mock).mockReturnValue([fakeUser, false]);

    const firebaseUtils = await import('@utils/firebase');

    fakePush.mockClear();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(firebaseUtils.logout).toHaveBeenCalled();
      expect(fakePush).toHaveBeenCalled();
    });
  });
});
