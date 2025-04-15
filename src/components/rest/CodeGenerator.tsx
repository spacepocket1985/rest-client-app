/* eslint-disable react-compiler/react-compiler */
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Request } from 'postman-collection';
import * as postmanCodegen from 'postman-code-generators';
import { UIHeader } from '@ui/UIHeader';

interface CodeGeneratorProps {
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body: string;
  bodyMode: 'json' | 'text';
}

type SupportedLanguage = {
  key: string;
  name: string;
  variant: string;
};

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { key: 'curl', name: 'cURL', variant: 'curl' },
  { key: 'javascript', name: 'JavaScript (Fetch)', variant: 'fetch' },
  { key: 'javascript-xhr', name: 'JavaScript (XHR)', variant: 'xhr' },
  { key: 'nodejs', name: 'Node.js', variant: 'native' },
  { key: 'python', name: 'Python', variant: 'requests' },
  { key: 'java', name: 'Java', variant: 'okhttp' },
  { key: 'csharp', name: 'C#', variant: 'restsharp' },
  { key: 'go', name: 'Go', variant: 'native' },
];

const DEFAULT_OPTIONS: postmanCodegen.ConvertOptions = {
  indentCount: 2,
  indentType: 'Space',
  trimRequestBody: true,
  followRedirect: true,
  requestTimeout: 0,
  multiLine: true,
};

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ method, url, headers, body, bodyMode }) => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('curl');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('PostamnCodeGen');

  const generateCode = () => {
    if (!url || !method) {
      setError(t('messages.requiredURLAndMethod'));

      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const filteredHeaders = headers.filter((h) => h.key.trim() !== '');

      const requestBody = {
        mode: 'raw' as const,
        raw: body,
        ...(bodyMode === 'json' && {
          options: {
            raw: {
              language: 'json',
            },
          },
        }),
      };

      const request = new Request({
        url,
        method,
        header: filteredHeaders.map((h) => ({ key: h.key, value: h.value })),
        body: requestBody,
      });

      const languageConfig = SUPPORTED_LANGUAGES.find((lang) => lang.key === selectedLanguage);

      if (!languageConfig) {
        return;
      }

      postmanCodegen.convert(selectedLanguage, languageConfig.variant, request, DEFAULT_OPTIONS, (err, snippet) => {
        setIsGenerating(false);
        if (err) {
          setError(t(`messages.failedGenerate`));
        } else {
          setGeneratedCode(snippet || '');
        }
      });
    } catch (err) {
      setIsGenerating(false);
      if (err instanceof Error) setError(t('messages.errorCreatingRequest'));
    }
  };

  useEffect(() => {
    if (url && method) {
      generateCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, url, headers, body, bodyMode, selectedLanguage]);

  return (
    <>
      <div className="flex justify-between items-center gap-3">
        <UIHeader text={t('title')} />
        <div className="flex justify-start gap-3">
          <UIHeader text={t('selectLang')} />
          <select
            id="language-select"
            className="border rounded p-2 w-full"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option
                key={lang.key}
                value={lang.key}
              >
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded">
        {isGenerating ?
          <div className="flex justify-center items-center p-4">
            <span className="mr-2">{t('genCode')}</span>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        : error ?
          <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>
        : <div className="relative">
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              <code>{generatedCode || t('messages.selecatLangTogenerate')}</code>
            </pre>
            {generatedCode && (
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="absolute  p-3 top-2 right-2 bg-gray-200 hover:bg-gray-300 p-1 rounded"
                title="Copy to clipboard"
              >
                {t('copy')}
              </button>
            )}
          </div>
        }
      </div>
    </>
  );
};

export default CodeGenerator;
