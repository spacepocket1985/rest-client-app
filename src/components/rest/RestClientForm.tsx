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
import { interpolateVariables, useDropdown, useLocalStorageVariables } from '@utils/variables';

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

  const variables = useLocalStorageVariables();
  const { showDropdown, dropdownPosition, openDropdown, closeDropdown } = useDropdown();
  const inputRef = React.useRef<HTMLInputElement>(null);

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

    const interpolatedUrl = interpolateVariables(url, variables);
    const interpolatedBody = interpolateVariables(body, variables);
    const filteredHeaders = headers
      .filter((h) => h.key.trim() !== '')
      .map((h) => ({
        key: interpolateVariables(h.key, variables),
        value: interpolateVariables(h.value, variables),
      }));

    handleUrl(true, method, interpolatedUrl, interpolatedBody, filteredHeaders);
  };

  useEffect(() => {
    const interpolatedUrl = interpolateVariables(url, variables);
    const interpolatedBody = interpolateVariables(body, variables);
    const filteredHeaders = headers
      .filter((h) => h.key.trim() !== '')
      .map((h) => ({
        key: interpolateVariables(h.key, variables),
        value: interpolateVariables(h.value, variables),
      }));

    handleUrl(false, method, interpolatedUrl, interpolatedBody, filteredHeaders);
  }, [method, url, body, headers, handleUrl, variables]);

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
            ref={inputRef}
            type="text"
            className="border rounded p-2 flex-grow"
            placeholder={t('placeholders.url')}
            value={url}
            onChange={(e) => {
              const val = e.target.value;

              setUrl(val);

              const cursorIndex = e.target.selectionStart ?? 0;
              const textBeforeCursor = val.slice(0, cursorIndex);

              if (textBeforeCursor.endsWith('{')) {
                const rect = e.target.getBoundingClientRect();

                openDropdown({
                  top: rect.top + window.scrollY + e.target.offsetHeight,
                  left: rect.left + window.scrollX,
                });
              } else {
                closeDropdown();
              }
            }}
            required
          />
          {showDropdown && (
            <ul
              className="absolute z-10 bg-white border shadow-md rounded max-h-60 overflow-auto"
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              {variables.map(({ key }) => (
                <li
                  key={key}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!inputRef.current) return;

                    const cursorPos = inputRef.current.selectionStart ?? url.length;
                    const before = url.slice(0, cursorPos - 1);
                    const after = url.slice(cursorPos);

                    const newValue = `${before}{{${key}}}${after}`;

                    setUrl(newValue);
                    closeDropdown();
                  }}
                >
                  {key}
                </li>
              ))}
            </ul>
          )}
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
          variables={variables}
        />
        <RequestBody
          value={body}
          onChange={setBody}
          onModeChange={setBodyMode}
          variables={variables}
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
