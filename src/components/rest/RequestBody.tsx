'use client';

import { UIHeader } from '@ui/UIHeader';

interface RequestBodyProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RequestBody({ value, onChange }: RequestBodyProps) {
  return (
    <div className="mb-4 text-left">
      <UIHeader text="Body" />
      <textarea
        className="border rounded p-2 w-full"
        rows={8}
        placeholder="Request body (JSON or plain text)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
