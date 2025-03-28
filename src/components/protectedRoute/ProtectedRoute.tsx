'use client';

import { useRouter } from 'next/navigation';
import { useEffect, PropsWithChildren, useState } from 'react';
import { Spinner } from '../spinner/Spinner';
import { useAuth } from '@context/AuthContext';
import { RoutePaths } from '@constants/routePaths';

export enum AuthRequirement {
  WithAuth,
  WithoutAuth,
}

const ProtectedRoute = (Component: (props: PropsWithChildren) => JSX.Element, authRequirement: AuthRequirement) => {
  const WrappedComponent: React.FC = (props: PropsWithChildren) => {
    const [isAuth, setIsAuth] = useState(false);

    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (user && authRequirement === AuthRequirement.WithAuth) {
        setIsAuth(true);
      } else if (!user && authRequirement === AuthRequirement.WithoutAuth) {
        setIsAuth(true);
      } else if (user && authRequirement === AuthRequirement.WithoutAuth) {
        router.push(RoutePaths.WELCOME);
      }
    }, [user, router]);
    if (isAuth) return <Component {...props} />;

    return <Spinner />;
  };

  return WrappedComponent;
};

export default ProtectedRoute;
