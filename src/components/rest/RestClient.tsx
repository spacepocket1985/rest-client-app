'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { UIButton } from '@ui/UIButton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { encodeBase64, spaceInBase64, decodeBase64 } from '@utils/base64';

interface RestClientProps {
  response: {
    result: string;
    status: number;
  };
}

function RestClient({ response }: RestClientProps) {
  const router = useRouter();
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const basePathIndex = pathParts.findIndex((part) => part === 'rest-client');

    if (basePathIndex >= 0 && pathParts.length > basePathIndex + 2) {
      const routeMethod = pathParts[basePathIndex + 1];

      if (Object.values(Method).includes(routeMethod.toUpperCase() as MethodType)) {
        setMethod(routeMethod.toUpperCase());
      }

      const encodedUrl = pathParts[basePathIndex + 2];

      if (encodedUrl && encodedUrl !== spaceInBase64) {
        try {
          setUrl(decodeBase64(encodedUrl));
        } catch (e) {
          console.error('Failed to decode URL:', e);
          setUrl('');
        }
      } else {
        setUrl('');
      }

      if (pathParts.length > basePathIndex + 3) {
        const encodedBody = pathParts[basePathIndex + 3];

        if (encodedBody && encodedBody !== spaceInBase64) {
          try {
            setBody(decodeBase64(encodedBody));
          } catch (e) {
            console.error('Failed to decode body:', e);
            setBody('');
          }
        } else {
          setBody('');
        }
      }
    }

    const searchParams = new URLSearchParams(window.location.search);
    const headerEntries = Array.from(searchParams.entries()).filter(([key]) => key.toLowerCase() !== 'locale');

    if (headerEntries.length > 0) {
      setHeaders(headerEntries.map(([key, value]) => ({ key, value })));
    } else {
      setHeaders([{ key: '', value: '' }]);
    }

    setIsInitialized(true);
  }, []);

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers];

    newHeaders.splice(index, 1);
    setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: '', value: '' }]);
  };

  const handleHeaderChange = (index: number, type: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];

    newHeaders[index] = { ...newHeaders[index], [type]: value };
    setHeaders(newHeaders);
  };

  const executeRequest = async () => {
    if (!url.trim()) return;

    setIsLoading(true);

    try {
      const encodedUrl = url.trim() ? encodeBase64(url.trim()) : spaceInBase64;
      const encodedBody = body.trim() ? encodeBase64(body.trim()) : spaceInBase64;

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
      console.error('Error executing request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">REST Client</h1>

      <div className="flex mb-4">
        <select
          className="border rounded p-2 mr-4"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {Object.values(Method).map((m) => (
            <option
              key={m}
              value={m}
            >
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="border rounded p-2 flex-grow"
          placeholder="Endpoint URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <UIButton
          onClick={executeRequest}
          text={isLoading ? 'Sending...' : 'Send Request'}
          disabled={isLoading || !url.trim()}
          className="ml-4"
        />
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Headers:</h2>
        {headers.map((header, index) => (
          <div
            className="flex mb-2 items-center"
            key={index}
          >
            <input
              type="text"
              className="border rounded p-2 mr-2 flex-grow"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
              placeholder="Header Key"
            />
            <input
              type="text"
              className="border rounded p-2 mr-2 flex-grow"
              value={header.value}
              onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
              placeholder="Header Value"
            />
            <button
              onClick={() => handleRemoveHeader(index)}
              className="bg-red-500 text-white rounded p-2 w-10 h-10 flex items-center justify-center"
              title="Remove header"
            >
              ×
            </button>
          </div>
        ))}
        <UIButton
          onClick={handleAddHeader}
          text="Add Header"
        />
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Body:</h2>
        <textarea
          className="border rounded p-2 w-full"
          rows={8}
          placeholder="Request body (JSON or plain text)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Response:</h2>
        <div className="mb-2">
          <strong>Status Code:</strong> {response.status}
        </div>
        <pre className="border rounded p-2 bg-gray-200 overflow-auto">
          {response.result ? JSON.stringify(JSON.parse(response.result), null, 2) : '{}'}
        </pre>
      </div>
    </div>
  );
}

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

type MethodType = keyof typeof Method;

export default ProtectedRoute(RestClient, AuthRequirement.WithAuth);
