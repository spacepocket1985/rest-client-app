'use client';

import { useTranslations } from 'next-intl';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { RoutePaths } from '@constants/routePaths';
import { UILink } from '@ui/UILink';

function History() {
  const t = useTranslations('WelcomePage');

  return (
    <>
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
