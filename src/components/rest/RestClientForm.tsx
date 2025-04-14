'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import RequestHeaders from './RequestHeaders';
import RequestBody from './RequestBody';
import ResponseView from './ResponseView';
import { Spinner } from '@components/spinner/Spinner';
import { UIButton } from '@ui/UIButton';
import { ApiResponse, Method, MethodType } from '@utils/makeRequest';
import React from 'react';
import CodeGenerator from './CodeGenerator';

interface RestClientFormProps<T> {
  initialMethod?: MethodType;
  initialUrl?: string;
  initialBody?: string;
  initialHeaders?: { key: string; value: string }[];
  response: ApiResponse<T>;

  isLoading: boolean;
  handleUrl: (
    executRequest: boolean,
    method?: string,
    url?: string,
    body?: string,
    headers?: { key: string; value: string }[],
  ) => Promise<void>;
}

function RestClientForm<T>({
  initialMethod = 'GET',
  initialUrl = '',
  initialBody = '{}',
  initialHeaders = [{ key: '', value: '' }],
  response,
  isLoading,
  handleUrl,
}: RestClientFormProps<T>) {
  const [method, setMethod] = useState<MethodType>(initialMethod);
  const [url, setUrl] = useState(initialUrl);
  const [body, setBody] = useState(initialBody);
  const [headers, setHeaders] = useState(initialHeaders);
  const [bodyMode, setBodyMode] = useState<'json' | 'text'>('json');

  const t = useTranslations('Rest');

  useEffect(() => {
    const contentType = bodyMode === 'json' ? 'application/json' : 'text/plain';

    const existingContentTypeIndex = headers.findIndex((h) => h.key.toLowerCase() === 'content-type');

    const newHeaders = [...headers];

    if (existingContentTypeIndex >= 0) {
      newHeaders[existingContentTypeIndex] = {
        key: 'Content-Type',
        value: contentType,
      };
    } else if (method !== 'GET') {
      newHeaders.push({
        key: 'Content-Type',
        value: contentType,
      });
    }

    setHeaders(newHeaders);
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyMode, method]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredHeaders = headers.filter((h) => h.key.trim() !== '');

    handleUrl(true, method, url, body, filteredHeaders);
  };

  useEffect(() => {
    handleUrl(false, method, url, body, headers);
  }, [method, url, body, headers, handleUrl]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t('titles.restClient')}</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex mb-4 gap-2">
          <select
            className="border rounded p-2 mr-4"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value as MethodType);
            }}
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
            placeholder={t('placeholders.url')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <UIButton
            type="submit"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? t('buttons.sending') : t('buttons.sendRequest')}
          </UIButton>
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
            // updateUrl();
          }}
        />
        <RequestBody
          value={body}
          onChange={setBody}
          onModeChange={setBodyMode}
        />

        <div>
          {isLoading && url ?
            <Spinner />
          : response ?
            <ResponseView response={response} />
          : null}
        </div>
      </form>
      <CodeGenerator
        method={method}
        url={url}
        headers={headers}
        body={body}
        bodyMode={bodyMode}
      />
    </div>
  );
}

export default React.memo(RestClientForm);
