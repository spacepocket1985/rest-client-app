'use client';

import { UIHeader } from '@ui/UIHeader';
import { allExpanded, defaultStyles, JsonView } from 'react-json-view-lite';

interface ResponseViewProps {
  response: {
    result: string;
    status: number;
  };
}

export default function ResponseView({ response }: ResponseViewProps) {
  const backgroundColor =
    response.status >= 200 && response.status < 300 ? 'bg-green-100'
    : response.status >= 400 ? 'bg-red-100'
    : 'bg-yellow-100';

  return (
    <div className={`mb-4 ${backgroundColor} p-4 rounded`}>
      <div className="flex justify-between items-center mb-2">
        <UIHeader text="Response" />
        <div className="flex items-center gap-4">
          <UIHeader text="Status Code:" />

          {response.status > 0 && <UIHeader text={response.status} />}
        </div>
      </div>
      <pre className="border rounded p-2 bg-gray-200 overflow-auto">
        <JsonView
          data={response.result ? response.result : 'Your response will be here'}
          shouldExpandNode={allExpanded}
          style={defaultStyles}
        />
      </pre>
    </div>
  );
}
