'use client';

import Link from 'next/link';
import { useAuth } from '@context/AuthContext';
import { logout } from '@utils/firebase';
import { RoutePaths } from 'src/constants/routePaths';
import { btnOrLinkStyle } from '@constants/btnOrLinkStyle';

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-gray-200 mb-4 p-5">
      <div className="flex justify-between items-center">
        <Link
          href={RoutePaths.WELCOME}
          className={btnOrLinkStyle}
        >
          {'Logo'}
        </Link>
        <div className="flex space-x-4">
          <button className={btnOrLinkStyle}>{'Language Toggle'}</button>
          {user ?
            <>
              <button
                onClick={logout}
                disabled={!!isLoading}
                className={btnOrLinkStyle}
              >
                {'Log out'}
              </button>
              <Link
                href={RoutePaths.WELCOME}
                className={btnOrLinkStyle}
              >
                {'Home'}
              </Link>
            </>
          : <>
              <Link
                href={RoutePaths.SIGNIN}
                className={btnOrLinkStyle}
              >
                {'Sign in'}
              </Link>
              <Link
                href={RoutePaths.SIGNUP}
                className={btnOrLinkStyle}
              >
                {'Sign up'}
              </Link>
            </>
          }
        </div>
      </div>
    </header>
  );
}
