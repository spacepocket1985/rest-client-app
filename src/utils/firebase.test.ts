import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword as signIn,
  signInWithEmailAndPassword,
  signOut as signOutUser,
  User,
} from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchUserName, logInWithEmailAndPassword, logout, registerWithEmailAndPassword, useUser } from './firebase';
import type { Mock } from 'vitest';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { renderHook } from '@testing-library/react';
import { deleteApp, getApps } from 'firebase/app';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn((...args) => args),
  where: vi.fn((...args) => args),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Firebase login/logout', () => {
  it('should log in with email and password', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    await logInWithEmailAndPassword(email, password);
    expect(signIn).toHaveBeenCalledWith(getAuth(), email, password);
  });

  it('should log out', () => {
    logout();
    expect(signOutUser).toHaveBeenCalled();
  });
});

describe('logInWithEmailAndPassword error', () => {
  it('throws an error when signInWithEmailAndPassword fails', async () => {
    const errorMessage = 'Invalid credentials';

    (signInWithEmailAndPassword as Mock).mockRejectedValue(new Error(errorMessage));
    await expect(logInWithEmailAndPassword('test@test.com', 'password')).rejects.toThrow(errorMessage);
  });
  it('handles non-error thrown rejection gracefully in logInWithEmailAndPassword', async () => {
    (signInWithEmailAndPassword as Mock).mockRejectedValue('Not an error');
    await expect(logInWithEmailAndPassword('test@test.com', 'password')).resolves.toBeUndefined();
  });
});

describe('registerWithEmailAndPassword', () => {
  it('creates user and writes to Firestore', async () => {
    const name = 'Alice';
    const email = 'alice@example.com';
    const password = 'pw';
    const fakeUid = 'UID123';

    (createUserWithEmailAndPassword as Mock).mockResolvedValue({ user: { uid: fakeUid } });

    const fakeCollRef = {};

    (collection as Mock).mockReturnValue(fakeCollRef);

    await registerWithEmailAndPassword(name, email, password);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
    expect(collection).toHaveBeenCalledWith(getFirestore(), 'users');
    expect(addDoc).toHaveBeenCalledWith(fakeCollRef, {
      uid: fakeUid,
      name,
      authProvider: 'local',
      email,
    });
  });

  it('throws when createUserWithEmailAndPassword fails', async () => {
    (createUserWithEmailAndPassword as Mock).mockRejectedValue(new Error('oops'));
    await expect(registerWithEmailAndPassword('x', 'x@x', 'p')).rejects.toThrow('oops');
  });

  it('handles non-error thrown rejection gracefully in registerWithEmailAndPassword', async () => {
    (createUserWithEmailAndPassword as Mock).mockRejectedValue('Not an error');
    await expect(registerWithEmailAndPassword('Alice', 'alice@example.com', 'pw')).resolves.toBeUndefined();
  });
});

describe('fetchUserName', () => {
  it('returns the name field for a found user', async () => {
    const user = { uid: 'UID1' } as User;
    const docs = [{ data: () => ({ name: 'Bob' }) }];

    (collection as Mock).mockReturnValue('collRef');
    (where as Mock).mockReturnValue('whereClause');
    (query as Mock).mockReturnValue('queryClause');
    (getDocs as Mock).mockResolvedValue({ docs });

    const result = await fetchUserName(user);

    expect(collection).toHaveBeenCalledWith(getFirestore(), 'users');
    expect(where).toHaveBeenCalledWith('uid', '==', user.uid);
    expect(query).toHaveBeenCalledWith('collRef', 'whereClause');
    expect(getDocs).toHaveBeenCalledWith('queryClause');
    expect(result).toBe('Bob');
  });

  it('alerts and returns undefined on error', async () => {
    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {});
    const user = { uid: 'UID2' } as User;

    (collection as Mock).mockReturnValue('collRef');
    (where as Mock).mockReturnValue('whereClause');
    (query as Mock).mockReturnValue('queryClause');
    (getDocs as Mock).mockRejectedValue(new Error('db down'));

    const result = await fetchUserName(user);

    expect(alertSpy).toHaveBeenCalledWith('An error occured while fetching user data');
    expect(result).toBeUndefined();

    alertSpy.mockRestore();
  });

  it('handles non-error thrown rejection gracefully in fetchUserName', async () => {
    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {});
    const user = { uid: 'UID3' } as User;

    (collection as Mock).mockReturnValue('collRef');
    (where as Mock).mockReturnValue('whereClause');
    (query as Mock).mockReturnValue('queryClause');
    (getDocs as Mock).mockRejectedValue('Not an error');

    const result = await fetchUserName(user);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
    alertSpy.mockRestore();
  });
});

describe('useUser hook', () => {
  it('returns the user when logged in', () => {
    const fakeUser = { uid: '123', displayName: 'Test User' };

    (useAuthState as Mock).mockReturnValue([fakeUser, false, null]);
    const { result } = renderHook(() => useUser());

    expect(result.current).toEqual(fakeUser);
  });
  it('returns null when no user is logged in', () => {
    (useAuthState as Mock).mockReturnValue([null, false, null]);
    const { result } = renderHook(() => useUser());

    expect(result.current).toBeNull();
  });
});

describe('Firebase Configuration', () => {
  beforeEach(async () => {
    vi.resetModules();
    const apps = getApps();

    await Promise.all(apps.map((app) => deleteApp(app)));
  });

  it('should use provided environment variables when set', async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'test-measurement-id';

    const firebaseModule = await import('./firebase');
    const { firebaseConfig } = firebaseModule;

    expect(firebaseConfig.apiKey).toBe('test-api-key');
    expect(firebaseConfig.authDomain).toBe('test-auth-domain');
    expect(firebaseConfig.projectId).toBe('test-project-id');
    expect(firebaseConfig.storageBucket).toBe('test-storage-bucket');
    expect(firebaseConfig.messagingSenderId).toBe('test-sender-id');
    expect(firebaseConfig.appId).toBe('test-app-id');
    expect(firebaseConfig.measurementId).toBe('test-measurement-id');
  });

  it('should fall back to empty strings when environment variables are not set', async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    delete process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

    const firebaseModule = await import('./firebase');
    const { firebaseConfig } = firebaseModule;

    expect(firebaseConfig.apiKey).toBe('');
    expect(firebaseConfig.authDomain).toBe('');
    expect(firebaseConfig.projectId).toBe('');
    expect(firebaseConfig.storageBucket).toBe('');
    expect(firebaseConfig.messagingSenderId).toBe('');
    expect(firebaseConfig.appId).toBe('');
    expect(firebaseConfig.measurementId).toBe('');
  });
});
