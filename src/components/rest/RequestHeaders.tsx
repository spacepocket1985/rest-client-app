'use client';

import { useTranslations } from 'next-intl';
import { UIButton } from '@ui/UIButton';
import { UIHeader } from '@ui/UIHeader';

interface RequestHeadersProps {
  headers: { key: string; value: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, type: 'key' | 'value', value: string) => void;
}

export default function RequestHeaders({ headers, onAdd, onRemove, onChange }: RequestHeadersProps) {
  const t = useTranslations('Rest');

  return (
    <div className="mb-4 text-left">
      <UIHeader text={t('titles.headers')} />

      {headers.map((header, index) => (
        <div
          className="flex mb-2 items-center gap-2"
          key={index}
        >
          <input
            type="text"
            className="border rounded p-2 mr-2 flex-grow"
            value={header.key}
            onChange={(e) => onChange(index, 'key', e.target.value)}
            placeholder={t('placeholders.headerkey')}
          />
          <input
            type="text"
            className="border rounded p-2 mr-2 flex-grow"
            value={header.value}
            onChange={(e) => onChange(index, 'value', e.target.value)}
            placeholder={t('placeholders.headerValue')}
          />
          <UIButton
            onClick={onAdd}
            text="+"
          />
          <UIButton
            onClick={() => onRemove(index)}
            title="Remove header"
            text="-"
          />
        </div>
      ))}
    </div>
  );
}
