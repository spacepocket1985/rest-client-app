'use client';

import { useTranslations } from 'next-intl';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { RoutePaths } from '@constants/routePaths';
import { UILink } from '@ui/UILink';
import { UIButton } from '@ui/UIButton';
import { useEffect, useState } from 'react';
import { addHistoryData, IHistoryRequest } from '@utils/history';

function History() {
  const t = useTranslations('WelcomePage');
  const [history, setHistory] = useState<IHistoryRequest[]>([]);

  useEffect(() => {
    const historyFromLS = localStorage.getItem('history-requests');

    if (historyFromLS != null && historyFromLS.length) setHistory(JSON.parse(historyFromLS));
  }, []);

  // TODO: Remove after REST client is implemented
  const generateHistoryItem = () => {
    addHistoryData({
      metod: 'GET',
      url: `'/test'${Math.random() * 100}`,
    });
    setHistory(JSON.parse(localStorage.getItem('history-requests')!));
  };

  const clearHistory = () => {
    localStorage.removeItem('history-requests');
    setHistory([]);
  };

  return (
    <>
      <div className="flex flex-row mt-4 mb-4 gap-[10px] justify-center">
        <UIButton onClick={generateHistoryItem}>Genetare request</UIButton>
        <UIButton onClick={clearHistory}>Clear history</UIButton>
      </div>
      <h2 className="text-4xl mt-2 mb-2">{'History Requests'}</h2>
      {history.length ?
        <div className="flex flex-col gap-[10px] mb-[20px]">
          {history
            .slice()
            .reverse()
            .map((item) => {
              return (
                <UILink
                  className="flex justify-between min-w-[50vw]"
                  href={item.url}
                  key={item.requestDate}
                >
                  <div>
                    {item.metod} {item.url}
                  </div>
                  <div>
                    {new Date(item.requestDate).toLocaleDateString()} {new Date(item.requestDate).toLocaleTimeString()}
                  </div>
                </UILink>
              );
            })}
        </div>
      : <>
          <p>{`You haven't executed any requests. It's empty here. Try:`}</p>
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
