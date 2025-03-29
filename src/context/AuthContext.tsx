'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { auth, fetchUserName, logout } from '@utils/firebase';
import { RoutePaths } from '@constants/routePaths';

type AuthContextProps = {
  user: User | null | undefined;
  name: string | null;
  loading: boolean;
  isLoading: boolean;
};

const OneMinute = 60000;
const OneHour = 3600000;

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<null | string>(null);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const lastCheckTimeRef = React.useRef<number | null>(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (loading) return;

      if (!user) {
        setName(null);
        setIsLoading(false);
        router.push(RoutePaths.WELCOME);

        return;
      }

      const token = await user.getIdToken();

      if (!token) {
        setName(null);
        router.push(RoutePaths.WELCOME);
        logout();

        return;
      }

      const currentTime = Date.now();

      if (lastCheckTimeRef.current && currentTime - lastCheckTimeRef.current > OneHour) {
        setName(null);
        router.push(RoutePaths.WELCOME);
        logout();

        return;
      }

      if (name === null) {
        const userName = await fetchUserName(user);

        setName(userName);
      }

      lastCheckTimeRef.current = currentTime;
      setIsLoading(false);
    };

    const interval = setInterval(checkTokenValidity, OneMinute);

    checkTokenValidity();

    return () => clearInterval(interval);
  }, [user, loading, router, name]);

  return <AuthContext.Provider value={{ user, loading, isLoading, name }}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
