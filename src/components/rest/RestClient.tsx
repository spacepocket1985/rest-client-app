'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { encodeBase64, spaceInBase64, decodeBase64 } from '@utils/base64';
import RestClientForm from './RestClientForm';
import { MethodType } from '@app/[locale]/(rest-client)/[...slug]/page';
import { notifyError } from '@utils/notify';

interface RestClientProps {
  response: {
    result: string;
    status: number;
  };
}

function RestClient({ response }: RestClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<{
    method: string;
    url: string;
    body: string;
    headers: { key: string; value: string }[];
  } | null>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const basePathIndex = pathParts.findIndex((part) => part === 'rest-client');

    let method = 'GET';
    let url = '';
    let body = '';
    const headers: { key: string; value: string }[] = [];

    if (basePathIndex >= 0 && pathParts.length > basePathIndex + 2) {
      method = pathParts[basePathIndex + 1];

      const encodedUrl = pathParts[basePathIndex + 2];

      if (encodedUrl && encodedUrl !== spaceInBase64) {
        try {
          url = decodeBase64(encodedUrl);
        } catch (error) {
          if (error instanceof Error) notifyError('Failed to decode URL');
        }
      }

      if (pathParts.length > basePathIndex + 3) {
        const encodedBody = pathParts[basePathIndex + 3];

        if (encodedBody && encodedBody !== spaceInBase64) {
          try {
            body = decodeBase64(encodedBody);
          } catch (error) {
            if (error instanceof Error) notifyError('Failed to decode body');
          }
        }
      }
    }

    const searchParams = new URLSearchParams(window.location.search);
    const headerEntries = Array.from(searchParams.entries()).filter(([key]) => key.toLowerCase() !== 'locale');

    if (headerEntries.length > 0) {
      headerEntries.forEach(([key, value]) => {
        headers.push({ key, value });
      });
    } else {
      headers.push({ key: '', value: '' });
    }

    setInitialData({
      method,
      url,
      body,
      headers,
    });
  }, []);

  const executeRequest = async ({
    method,
    url,
    body,
    headers,
  }: {
    method: string;
    url: string;
    body: string;
    headers: { key: string; value: string }[];
  }) => {
    if (!url.trim()) return;

    setIsLoading(true);

    try {
      const encodedUrl = url.trim() ? encodeBase64(url.trim()) : '';
      const encodedBody = body.trim() ? encodeBase64(body.trim()) : '';

      const queryParams = new URLSearchParams();

      headers.forEach(({ key, value }) => {
        if (key.trim()) {
          queryParams.append(key.trim(), value.trim());
        }
      });

      const basePath = '/rest-client';
      const newPath = `${basePath}/${method.toLowerCase()}/${encodedUrl}/${encodedBody}`;
      const newUrl = queryParams.toString() ? `${newPath}?${queryParams.toString()}` : newPath;

      router.push(newUrl);
    } catch (error) {
      if (error instanceof Error) notifyError('Error executing request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <RestClientForm
      initialMethod={initialData.method as MethodType}
      initialUrl={initialData.url}
      initialBody={initialData.body}
      initialHeaders={initialData.headers}
      response={response}
      onSubmit={executeRequest}
      isLoading={isLoading}
    />
  );
}

export default ProtectedRoute(RestClient, AuthRequirement.WithAuth);
