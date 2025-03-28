/* eslint-disable react-refresh/only-export-components */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

import { User } from 'firebase/auth';
import { auth, fetchUserName } from '@utils/firebase';
import { Spinner } from '@components/spinner/Spinner';

type AuthContextProps = {
  user: User | null | undefined;
  name: string | null;
  loading: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<null | string>(null);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      if (!user) {
        setName(null);
        setIsLoading(false);

        return;
      }

      if (user) {
        const userName = await fetchUserName(user);

        setName(userName);

        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, isLoading, name }}>
      {isLoading ?
        <Spinner />
      : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
