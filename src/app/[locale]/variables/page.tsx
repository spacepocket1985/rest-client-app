'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@components/spinner/Spinner';

export default function VariablesPage() {
  return <ProtectedVariablesSection />;
}

const ProtectedVariablesSection = dynamic(() => import('@components/variablesSection/VariablesSection'), {
  loading: () => <Spinner />,
  ssr: false,
});
