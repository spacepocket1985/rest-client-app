'use client';

import { RoutePaths } from '@constants/routePaths';
import { useAuth } from '@context/AuthContext';
import { UILink } from '@ui/UILink';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Welcome() {
  const { user, name } = useAuth();
  const t = useTranslations('Header');

  const userLinks = [
    { title: 'Rest-client', link: RoutePaths.REST },
    { title: 'History', link: RoutePaths.History },
    { title: 'Variables', link: RoutePaths.Variables },
  ];

  const renderUserLinks = userLinks.map((item) => (
    <UILink
      key={item.link}
      text={item.title}
      href={item.link}
      className="min-w-[120px]"
    />
  ));

  return (
    <>
      <div className="max-w-[1024px]">
        <h2>{name ? `Welcome back, ${name}!` : 'Welcome!'}</h2>
        <div>
          <p>
            {
              'This application is a light-weight platform for using and building APIs. It supports method selection, URL, headers. It was created by team of students during react course at RS School. Try it!'
            }
          </p>
        </div>
        {user ?
          <>
            <div className="flex flex-col items-center">
              <div className="flex flex-row mt-4 mb-4 gap-[10px]">{renderUserLinks}</div>
            </div>
          </>
        : <div className="flex flex-row mt-4 mb-4 gap-[10px] justify-center">
            {' '}
            <UILink
              text={t('signIn')}
              href={RoutePaths.SIGNIN}
            />
            <UILink
              text={t('signUp')}
              href={RoutePaths.SIGNUP}
            />
          </div>
        }{' '}
        <div>
          <div>
            <p>{'RS School React Course'}</p>
            <p>
              {
                'RS School is a free and community-based online education program conducted by The Rolling Scopes Community since 2013. Currently 500+ developers from different countries and companies involve in the education process as mentors.'
              }
            </p>
          </div>
          <div>
            <p>{'Developers'}</p>{' '}
            <div className="flex flex-row justify-center gap-2">
              <UILink href={''}>
                {' '}
                <Image
                  src="https://avatars.githubusercontent.com/u/107361757?v=4"
                  width={150}
                  height={150}
                  alt="Picture of the author"
                  className="rounded-full"
                />
                <p>{'Aliaksandr Klintsevich'}</p>
                <p>{'Team-lead, developer'}</p>
              </UILink>
              <UILink href={''}>
                <Image
                  src="https://avatars.githubusercontent.com/u/65964059?v=4"
                  width={150}
                  height={150}
                  alt="Picture of the author"
                  className="rounded-full"
                />
                <p>{'Mykhailo Nikolaiev'}</p>
                <p>{'Developer'}</p>
              </UILink>
              <UILink href={''}>
                <Image
                  src="https://avatars.githubusercontent.com/u/94953757?v=4"
                  width={150}
                  height={150}
                  alt="Picture of the author"
                  className="rounded-full"
                />
                <p>{'Oleksandr Mazghin'}</p>
                <p>{'Developer'}</p>
              </UILink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
