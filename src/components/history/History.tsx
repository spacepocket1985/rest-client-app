'use client';

import { useTranslations } from 'next-intl';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { RoutePaths } from '@constants/routePaths';
import Link from 'next/link';
import { UILink } from '@ui/UILink';
import { UIButton } from '@ui/UIButton';
import { useEffect, useState } from 'react';
import { IHistoryRequest } from '@utils/history';
import { UIHeader } from '@ui/UIHeader';

function History() {
  const t = useTranslations('History');
  const [history, setHistory] = useState<IHistoryRequest[]>([]);

  useEffect(() => {
    const historyFromLS = localStorage.getItem('history-requests');

    if (historyFromLS != null && historyFromLS.length) setHistory(JSON.parse(historyFromLS));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('history-requests');
    setHistory([]);
  };

  return (
    <>
      <h2 className="text-4xl mt-2 mb-2">{t('title')}</h2>

      {history.length ?
        <div className="flex flex-col gap-[10px] items-start mb-[20px] mt-[10px]">
          <UIButton
            onClick={clearHistory}
            className="w-[150px]"
          >
            {t('clear')}
          </UIButton>
          {history
            .slice()
            .reverse()
            .map((item, index) => {
              return (
                <Link
                  className="flex items-center gap-4"
                  href={item.link}
                  key={index}
                >
                  <UIHeader text={item.method} />
                  <UIHeader text={item.url} />
                </Link>
              );
            })}
        </div>
      : <>
          <p>{t('description')}</p>
          <UILink
            href={RoutePaths.REST}
            className="min-w-[120px] mt-4 mb-4"
          >
            {t('restClient')}
          </UILink>
        </>
      }
    </>
  );
}

export default ProtectedRoute(History, AuthRequirement.WithAuth);
