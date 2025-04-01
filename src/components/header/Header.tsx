'use client';

import Link from 'next/link';
import { useAuth } from '@context/AuthContext';
import { logout } from '@utils/firebase';
import { RoutePaths } from 'src/constants/routePaths';
import { LangSwitcher } from './LangSwitcher';

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-gray-200 mb-4 p-5">
      <div className="flex justify-between items-center">
        <Link
          href={RoutePaths.WELCOME}
          className="text-lg font-bold"
        >
          {'Logo'}
        </Link>
        <div className="flex space-x-4">
          <LangSwitcher />
          {user ?
            <>
              <button
                onClick={logout}
                disabled={!!isLoading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {'Log out'}
              </button>
              <Link
                href={RoutePaths.WELCOME}
                className="text-blue-600 hover:underline"
              >
                {'Home'}
              </Link>
            </>
          : <>
              <Link
                href={RoutePaths.SIGNIN}
                className="text-blue-600 hover:underline"
              >
                {'Sign in'}
              </Link>
              <Link
                href={RoutePaths.SIGNUP}
                className="text-blue-600 hover:underline"
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
