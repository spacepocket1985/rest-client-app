'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { encodeBase64, spaceInBase64, decodeBase64 } from '@utils/base64';
import RestClientForm from './RestClientForm';
import { notifyError } from '@utils/notify';
import { addHistoryData } from '@utils/history';
import { ApiResponse, MethodType } from '@utils/makeRequest';

interface RestClientProps<T = unknown> {
  response: ApiResponse<T>;
  locale: string;
}

function RestClient({ response, locale }: RestClientProps) {
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

  const handleUrl = useCallback(
    async (
      executRequest: boolean,
      method?: string,
      url?: string,
      body?: string,
      headers?: { key: string; value: string }[],
    ) => {
      const normalizedMethod = method?.trim() || 'GET';
      const normalizedUrl = url?.trim() || '';
      const normalizedBody = body?.trim() || '';
      const normalizedHeaders = headers?.filter(({ key }) => key?.trim()) || [{ key: '', value: '' }];

      setIsLoading(true);

      try {
        const encodedUrl = normalizedUrl ? encodeBase64(normalizedUrl) + '/' : '';
        const encodedBody = normalizedBody ? encodeBase64(normalizedBody) : '';

        const queryParams = new URLSearchParams();

        normalizedHeaders.forEach(({ key, value }) => {
          if (key.trim()) {
            queryParams.append(key.trim(), value.trim());
          }
        });

        const basePath = `/${locale}/rest-client`;
        const newPath = `${basePath}/${normalizedMethod.toUpperCase()}/${encodedUrl}${encodedBody}`;
        const newUrl = queryParams.toString() ? `${newPath}?${queryParams.toString()}` : newPath;

        if (executRequest) {
          router.push(newUrl);
          addHistoryData({
            method: normalizedMethod.toUpperCase(),
            url: normalizedUrl,
            link: newUrl,
          });
        } else window.history.replaceState(null, '', newUrl);
      } catch (error) {
        if (error instanceof Error) notifyError('Error executing request');
      } finally {
        setIsLoading(false);
      }
    },
    [locale, router],
  );

  if (!initialData) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <RestClientForm
      initialMethod={response.method as MethodType}
      initialUrl={initialData.url}
      initialBody={initialData.body}
      initialHeaders={initialData.headers}
      response={response}
      isLoading={isLoading}
      handleUrl={handleUrl}
    />
  );
}

export default ProtectedRoute(RestClient, AuthRequirement.WithAuth);
