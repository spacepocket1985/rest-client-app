'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';

function RestClient() {
  return <h2>{'Rest-client'}</h2>;
}

export default ProtectedRoute(RestClient, AuthRequirement.WithAuth);
