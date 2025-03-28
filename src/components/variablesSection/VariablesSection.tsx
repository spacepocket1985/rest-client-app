'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';

function VariablesSection() {
  return <h2>{'Variables'}</h2>;
}

export default ProtectedRoute(VariablesSection, AuthRequirement.WithAuth);
