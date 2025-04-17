'use client';

import { useTranslations } from 'next-intl';
import { UIButton } from '@ui/UIButton';
import { UIHeader } from '@ui/UIHeader';
import { useRef, useState } from 'react';
import { useDropdown } from '@utils/variables';

interface RequestHeadersProps {
  headers: { key: string; value: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, type: 'key' | 'value', value: string) => void;
  variables: { key: string; value: string }[];
}

export default function RequestHeaders({ headers, onAdd, onRemove, onChange, variables }: RequestHeadersProps) {
  const t = useTranslations('Rest');

  const { showDropdown, dropdownPosition, openDropdown, closeDropdown } = useDropdown();
  const [focusedHeader, setFocusedHeader] = useState<{ index: number; field: 'key' | 'value' } | null>(null);

  const inputRefs = useRef<Record<'key' | 'value', HTMLInputElement | null>[]>([]);

  return (
    <div className="mb-4 text-left relative">
      <UIHeader text={t('titles.headers')} />

      {headers.map((header, index) => (
        <div
          className="flex mb-2 items-center gap-2"
          key={index}
        >
          <input
            ref={(el) => {
              if (!inputRefs.current[index]) inputRefs.current[index] = { key: null, value: null };
              inputRefs.current[index].key = el;
            }}
            type="text"
            className="border rounded p-2 mr-2 flex-grow"
            value={header.key}
            onChange={(e) => {
              onChange(index, 'key', e.target.value);
              const cursorPos = e.target.selectionStart ?? 0;
              const textBeforeCursor = e.target.value.slice(0, cursorPos);

              if (textBeforeCursor.endsWith('{')) {
                const rect = e.target.getBoundingClientRect();

                openDropdown({
                  top: rect.top + window.scrollY + e.target.offsetHeight,
                  left: rect.left + window.scrollX,
                });
                setFocusedHeader({ index, field: 'key' });
              } else {
                closeDropdown();
                setFocusedHeader(null);
              }
            }}
            placeholder={t('placeholders.headerkey')}
          />
          <input
            ref={(el) => {
              if (!inputRefs.current[index]) inputRefs.current[index] = { key: null, value: null };
              inputRefs.current[index].value = el;
            }}
            type="text"
            className="border rounded p-2 mr-2 flex-grow"
            value={header.value}
            onChange={(e) => {
              onChange(index, 'value', e.target.value);
              const cursorPos = e.target.selectionStart ?? 0;
              const textBeforeCursor = e.target.value.slice(0, cursorPos);

              if (textBeforeCursor.endsWith('{')) {
                const rect = e.target.getBoundingClientRect();

                openDropdown({
                  top: rect.top + window.scrollY + e.target.offsetHeight,
                  left: rect.left + window.scrollX,
                });
                setFocusedHeader({ index, field: 'value' });
              } else {
                closeDropdown();
                setFocusedHeader(null);
              }
            }}
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

      {showDropdown && focusedHeader && (
        <ul
          className="fixed z-10 bg-white border rounded shadow-md max-h-60 overflow-auto"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          {variables.map(({ key }) => (
            <li
              key={key}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={(e) => {
                e.preventDefault();

                const inputEl = inputRefs.current[focusedHeader.index]?.[focusedHeader.field];

                if (!inputEl) return;

                const pos = inputEl.selectionStart ?? inputEl.value.length;
                const before = inputEl.value.slice(0, pos - 1);
                const after = inputEl.value.slice(pos);
                const newVal = `${before}{{${key}}}${after}`;

                onChange(focusedHeader.index, focusedHeader.field, newVal);
                closeDropdown();
              }}
            >
              {key}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
