import { useRouter } from 'next/navigation';
import { useEffect, PropsWithChildren, useState } from 'react';
import { Spinner } from '../spinner/Spinner';
import { useAuth } from '@context/AuthContext';

const ProtectedRoute = (Component: (props: PropsWithChildren) => JSX.Element, withAuth: boolean = false) => {
  const WrappedComponent: React.FC = (props: PropsWithChildren) => {
    const [isAuth, setIsAuth] = useState(false);

    const { user } = useAuth();
    const router = useRouter();
    console.log('withAuth = ', withAuth);
    console.log('user= ', user);
    useEffect(() => {
      if (user && withAuth) {
        setIsAuth(true);
      } else if (!user && !withAuth) {
        setIsAuth(true);
      } else if (user && !withAuth) {
        router.push(`/`);
      }
    }, [user, router]);
    if (isAuth) return <Component {...props} />;

    return <Spinner />;
  };

  return WrappedComponent;
};

export default ProtectedRoute;
