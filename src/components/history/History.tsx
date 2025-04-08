'use client';

import { useTranslations } from 'next-intl';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { RoutePaths } from '@constants/routePaths';
import { UILink } from '@ui/UILink';
import { UIButton } from '@ui/UIButton';
import { useEffect, useState } from 'react';
import { addHistoryData, IHistoryRequest } from '@utils/history';

function History() {
  const t = useTranslations('History');
  const [history, setHistory] = useState<IHistoryRequest[]>([]);

  useEffect(() => {
    const historyFromLS = localStorage.getItem('history-requests');

    if (historyFromLS != null && historyFromLS.length) setHistory(JSON.parse(historyFromLS));
  }, []);

  // TODO: Remove after REST client is implemented
  const generateHistoryItem = () => {
    addHistoryData({
      method: 'GET',
      url: `test/${Math.random() * 100}`,
    });
    setHistory(JSON.parse(localStorage.getItem('history-requests')!));
  };

  const clearHistory = () => {
    localStorage.removeItem('history-requests');
    setHistory([]);
  };

  return (
    <>
      <h2 className="text-4xl mt-2 mb-2">{t('title')}</h2>
      <UIButton
        onClick={generateHistoryItem}
        className="mt-4 mb-4"
      >
        Genetare request
      </UIButton>
      {history.length ?
        <div className="flex flex-col gap-[10px] items-center mb-[20px]">
          <UIButton
            onClick={clearHistory}
            className="w-[150px]"
          >
            {t('clear')}
          </UIButton>
          {history
            .slice()
            .reverse()
            .map((item) => {
              return (
                <UILink
                  className="flex justify-between min-w-[50vw]"
                  href={`${item.method}/${item.url}`}
                  key={item.requestDate}
                >
                  <div>
                    {item.method} {item.url}
                  </div>
                  <div>
                    {new Date(item.requestDate).toLocaleDateString()} {new Date(item.requestDate).toLocaleTimeString()}
                  </div>
                </UILink>
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
