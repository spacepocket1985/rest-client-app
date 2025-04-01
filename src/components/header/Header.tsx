'use client';

import { useAuth } from '@context/AuthContext';
import { logout } from '@utils/firebase';
import { RoutePaths } from 'src/constants/routePaths';
import { LangSwitcher } from './LangSwitcher';
import { UIButton } from '@ui/UIButton';
import { UILink } from '@ui/UILink';

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-gray-200 mb-4 p-5">
      <div className="flex justify-between items-center">
        <UILink
          text={'Logo'}
          href={RoutePaths.WELCOME}
        />

        <div className="flex space-x-4">
          <LangSwitcher />
          <UIButton text={'Language Toggle'} />
          {user ?
            <>
              <UIButton
                text={'Log out'}
                onClick={logout}
                disabled={!!isLoading}
              />

              <UILink
                text={'Home'}
                href={RoutePaths.WELCOME}
              />
            </>
          : <>
              <UILink
                text={'Sign in'}
                href={RoutePaths.SIGNIN}
              />
              <UILink
                text={'Sign up'}
                href={RoutePaths.SIGNUP}
              />
            </>
          }
        </div>
      </div>
    </header>
  );
}
