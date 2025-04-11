'use client';

import { useState } from 'react';
import RequestHeaders from './RequestHeaders';
import RequestBody from './RequestBody';
import ResponseView from './ResponseView';
import { Method, MethodType } from '@app/[locale]/(rest-client)/[...slug]/page';
import { Spinner } from '@components/spinner/Spinner';

interface RestClientFormProps {
  initialMethod?: MethodType;
  initialUrl?: string;
  initialBody?: string;
  initialHeaders?: { key: string; value: string }[];
  response: {
    result: string;
    status: number;
  };
  onSubmit: (params: {
    method: MethodType;
    url: string;
    body: string;
    headers: { key: string; value: string }[];
  }) => void;
  isLoading: boolean;
}

export default function RestClientForm({
  initialMethod = 'GET',
  initialUrl = '',
  initialBody = '',
  initialHeaders = [{ key: '', value: '' }],
  response,
  onSubmit,
  isLoading,
}: RestClientFormProps) {
  const [method, setMethod] = useState<MethodType>(initialMethod);
  const [url, setUrl] = useState(initialUrl);
  const [body, setBody] = useState(initialBody);
  const [headers, setHeaders] = useState(initialHeaders);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ method, url, body, headers });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">REST Client</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex mb-4">
          <select
            className="border rounded p-2 mr-4"
            value={method}
            onChange={(e) => setMethod(e.target.value as MethodType)}
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
            required
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>

        <RequestHeaders
          headers={headers}
          onAdd={() => setHeaders([...headers, { key: '', value: '' }])}
          onRemove={(index) => {
            const newHeaders = [...headers];

            newHeaders.splice(index, 1);
            setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: '', value: '' }]);
          }}
          onChange={(index, type, value) => {
            const newHeaders = [...headers];

            newHeaders[index] = { ...newHeaders[index], [type]: value };
            setHeaders(newHeaders);
          }}
        />

        <RequestBody
          value={body}
          onChange={setBody}
        />
        <div>
          {isLoading && url ?
            <Spinner />
          : response ?
            <ResponseView response={response} />
          : null}
        </div>
      </form>
    </div>
  );
}
