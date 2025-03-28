'use client';

import { btnOrLinkStyle } from '@constants/btnOrLinkStyle';
import { RoutePaths } from '@constants/routePaths';
import { useAuth } from '@context/AuthContext';
import Link from 'next/link';

export default function Welcome() {
  const { user, name } = useAuth();

  return (
    <>
      <div>
        <h2>{name ? `Welcome back, ${name}!` : 'Welcome!'}</h2>
        {user ?
          <>
            <div>
              <h3>{'Available utilities and features'}</h3>
              <div className="flex flex-col space-y-2 mt-4">
                <Link
                  href={RoutePaths.REST}
                  className={btnOrLinkStyle}
                >
                  {'Rest-client'}
                </Link>
                <Link
                  href={RoutePaths.History}
                  className={btnOrLinkStyle}
                >
                  {'History'}
                </Link>
                <Link
                  href={RoutePaths.Variables}
                  className={btnOrLinkStyle}
                >
                  {'Variables'}
                </Link>
              </div>
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
