'use client';

import { useTranslations } from 'next-intl';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { RoutePaths } from '@constants/routePaths';
import { UILink } from '@ui/UILink';
import { UIButton } from '@ui/UIButton';

function History() {
  const t = useTranslations('WelcomePage');

  const generateHistory = () => {
    localStorage.setItem(
      'history-requests',
      JSON.stringify({
        metod: 'GET',
        url: 'testurlqwerty',
      }),
    );
  };

  const clearHistory = () => {
    localStorage.removeItem('history-requests');
  };

  return (
    <>
      <div className="flex flex-row mt-4 mb-4 gap-[10px] justify-center">
        <UIButton onClick={generateHistory}>Genetare history</UIButton>
        <UIButton onClick={clearHistory}>Clear history</UIButton>
      </div>

      <h2 className="text-4xl mt-2 mb-2">{'History Requests'}</h2>
      <p>{`You haven't executed any requests. It's empty here. Try:`}</p>
      <UILink
        href={RoutePaths.REST}
        className="min-w-[120px] mt-4 mb-4"
      >
        {t('restClient')}
      </UILink>
    </>
  );
}

export default ProtectedRoute(History, AuthRequirement.WithAuth);
