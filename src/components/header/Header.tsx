'use client';

import { useAuth } from '@context/AuthContext';
import { logout } from '@utils/firebase';
import { RoutePaths } from 'src/constants/routePaths';
import { LangSwitcher } from './LangSwitcher';
import { UIButton } from '@ui/UIButton';
import { UILink } from '@ui/UILink';
import { useTranslations } from 'next-intl';

export default function Header() {
  const { user, isLoading } = useAuth();
  const t = useTranslations('Header');

  return (
    <header className="bg-gray-200 mb-4 p-5">
      <div className="flex justify-between items-center">
        <UILink href={RoutePaths.WELCOME}>{'REST Client'}</UILink>

        <div className="flex space-x-4 items-center">
          <LangSwitcher />
          {user ?
            <>
              <UIButton
                text={t('logout')}
                onClick={logout}
                disabled={!!isLoading}
              />

              <UILink
                text={t('home')}
                href={RoutePaths.WELCOME}
              />
            </>
          : <>
              <UILink
                text={t('signIn')}
                href={RoutePaths.SIGNIN}
              />
              <UILink
                text={t('signUp')}
                href={RoutePaths.SIGNUP}
              />
            </>
          }
        </div>
      </div>
    </header>
  );
}
