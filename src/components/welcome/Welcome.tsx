'use client';

import { RoutePaths } from '@constants/routePaths';
import { useAuth } from '@context/AuthContext';
import { UILink } from '@ui/UILink';

export default function Welcome() {
  const { user, name } = useAuth();

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
    />
  ));

  return (
    <>
      <div>
        <h2>{name ? `Welcome back, ${name}!` : 'Welcome!'}</h2>
        {user ?
          <>
            <div>
              <h3>{'Available utilities and features'}</h3>
              <div className="flex flex-col space-y-2 mt-4">{renderUserLinks}</div>
            </div>
          </>
        : <>
            <div>
              <p>{'Block about app'}</p>
              <p>{'Block about team'}</p>
              <p>{'Block about RsSchool'}</p>
            </div>
          </>
        }
      </div>
    </>
  );
}
