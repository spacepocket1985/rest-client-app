'use client';

import { useTranslations } from 'next-intl';
import { UIHeader } from '@ui/UIHeader';
import { ApiResponse } from '@utils/makeRequest';
import { defaultStyles, JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface ResponseViewProps<T> {
  response: ApiResponse<T>;
}

export default function ResponseView<T>({ response }: ResponseViewProps<T>) {
  const t = useTranslations('Rest');
  const backgroundColor =
    response.status >= 200 && response.status < 300 ? 'bg-green-100'
    : response.status >= 400 ? 'bg-red-100'
    : 'bg-yellow-100';

  return (
    <div className={`mb-4 ${backgroundColor} p-4 rounded`}>
      <div className="flex justify-between items-center mb-2">
        <UIHeader text={t('titles.response')} />
        <div className="flex items-center gap-4">
          <UIHeader text={t('titles.statusCode')} />

          {response.status > 0 && <UIHeader text={response.status} />}
        </div>
      </div>
      <pre className="border rounded p-2 bg-gray-200 overflow-auto">
        <JsonView
          data={
            response.status > 0 ?
              response.result || { error: response.error || 'An error occurred' }
            : t('messages.respons')
          }
          shouldExpandNode={(level) => level <= 2}
          style={defaultStyles}
        />
      </pre>
    </div>
  );
}
