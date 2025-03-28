'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';

function History() {
  return <h2>{'History'}</h2>;
}

export default ProtectedRoute(History, AuthRequirement.WithAuth);
