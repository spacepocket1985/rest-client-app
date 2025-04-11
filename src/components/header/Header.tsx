'use client';

import { useEffect, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
      sticky top-0 z-50 w-full 
      bg-gray-200 transition-all duration-300
      ${isScrolled ? 'bg-gray-400 shadow-md' : ''}
      py-4 px-6
    `}
    >
      <div className="container mx-auto flex justify-between items-center">
        <UILink
          href={RoutePaths.WELCOME}
          className="text-xl font-bold"
        >
          REST Client
        </UILink>

        <div className="flex items-center gap-4">
          <LangSwitcher />

          {user ?
            <>
              <UIButton
                text={t('logout')}
                onClick={logout}
                disabled={isLoading}
                className="min-w-[100px]"
              />
              <UILink
                href={RoutePaths.WELCOME}
                text={t('home')}
              />
            </>
          : <>
              <UILink
                href={RoutePaths.SIGNIN}
                text={t('signIn')}
              />
              <UILink
                href={RoutePaths.SIGNUP}
                text={t('signUp')}
              />
            </>
          }
        </div>
      </div>
    </header>
  );
}
