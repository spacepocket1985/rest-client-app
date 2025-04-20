'use client';

import { RoutePaths } from '@constants/routePaths';
import { useAuth } from '@context/AuthContext';
import { UILink } from '@ui/UILink';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Welcome() {
  const { user, name } = useAuth();
  const t = useTranslations('WelcomePage');

  const teamInfo = [
    {
      name: t('dev1'),
      role: t('teamLead'),
      github: 'https://github.com/spacepocket1985',
      avatar: 'https://avatars.githubusercontent.com/u/107361757?v=4',
    },
    {
      name: t('dev2'),
      role: t('developer'),
      github: 'https://github.com/ab3MN',
      avatar: 'https://avatars.githubusercontent.com/u/65964059?v=4',
    },
    {
      name: t('dev3'),
      role: t('developer'),
      github: 'https://github.com/ordinaraviro',
      avatar: 'https://avatars.githubusercontent.com/u/94953757?v=4',
    },
  ];

  const userLinks = [
    { title: t('restClient'), link: RoutePaths.REST },
    { title: t('history'), link: RoutePaths.History },
    { title: t('variables'), link: RoutePaths.Variables },
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
      <div className="flex flex-col justify-between gap-[40px] max-w-[1024px]">
        <div>
          {' '}
          <h2 className="text-4xl mt-2 mb-2">{name ? `${t('welcomeBack')}, ${name}!` : `${t('welcome')}`}</h2>
          <div>
            <p>{t('appDescription')}</p>
          </div>
          {user ?
            <>
              <div className="flex flex-col items-center">
                <div className="flex flex-row mt-4 mb-4 gap-[10px]">{renderUserLinks}</div>
              </div>
            </>
          : <div className="flex flex-row mt-4 mb-4 gap-[10px] justify-center">
              <UILink
                text={t('signIn')}
                href={RoutePaths.SIGNIN}
              />
              <UILink
                text={t('signUp')}
                href={RoutePaths.SIGNUP}
              />
            </div>
          }
        </div>

        <div>
          <h2 className="text-4xl mt-2 mb-2">{t('rsTitle')}</h2>
          <p className="mb-2">{t('rsDescription')}</p>
          <UILink
            href={'https://rs.school/'}
            target="_blank"
            text={t('rsLink')}
          />
        </div>
        <div>
          <h2 className="text-4xl mt-2 mb-4">{t('devsTitle')}</h2>
          <div className="flex flex-row justify-center gap-2">
            {teamInfo.map((item) => {
              return (
                <UILink
                  key={item.name}
                  href={item.github}
                  target="_blank"
                >
                  <Image
                    src={item.avatar}
                    width={150}
                    height={150}
                    alt="Picture of the author"
                    className="rounded-full"
                  />
                  <p>{item.name}</p>
                  <p>{item.role}</p>
                </UILink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
