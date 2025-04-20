'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@components/spinner/Spinner';

const ProtectedHistory = dynamic(() => import('@components/history/History'), {
  loading: () => <Spinner />,
  ssr: false,
});

export default function HistoryPage() {
  return <ProtectedHistory />;
}
