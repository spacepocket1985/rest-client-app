'use client';

import { allExpanded, defaultStyles, JsonView } from 'react-json-view-lite';

interface ResponseViewProps {
  response: {
    result: string;
    status: number;
  };
}

export default function ResponseView({ response }: ResponseViewProps) {
  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2">Response:</h2>
      <div className="mb-2">
        <strong>Status Code:</strong> {response.status > 0 && response.status}
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
