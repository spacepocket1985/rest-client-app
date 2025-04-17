'use client';

import { useTranslations } from 'next-intl';
import CodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { UIHeader } from '@ui/UIHeader';
import { UIButton } from '@ui/UIButton';
import { useRef, useState } from 'react';
import { notifyError } from '@utils/notify';

type EditorModeType = 'json' | 'text';

interface RequestBodyProps {
  value: string;
  onChange: (value: string) => void;
  mode?: EditorModeType;
  onModeChange?: (mode: EditorModeType) => void;
  variables: { key: string; value: string }[];
}

export default function RequestBody({ value, onChange, mode = 'json', onModeChange, variables }: RequestBodyProps) {
  const [editorMode, setEditorMode] = useState<EditorModeType>(mode);
  const extensions = editorMode === 'json' ? [json()] : [];

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const t = useTranslations('Rest');

  const handleModeChange = (newMode: EditorModeType) => {
    setEditorMode(newMode);
    onModeChange?.(newMode);
  };

  const prettyPrintJson = () => {
    if (editorMode !== 'json') return;

    try {
      const parsed = JSON.parse(value);
      const prettyJson = JSON.stringify(parsed, null, 2);

      onChange(prettyJson);
    } catch (error) {
      if (error instanceof Error) notifyError(`${t('messages.invalidJSON')} ${error.message}`);
    }
  };

  return (
    <div className="mb-4 text-left">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-3">
          <UIHeader text={t('titles.body')} />
          <select
            className="border rounded p-2 mr-4"
            value={editorMode}
            onChange={(e) => {
              handleModeChange(e.target.value as EditorModeType);
            }}
          >
            <option value="json">JSON</option>
            <option value="text">{t('select.text')}</option>
          </select>
        </div>
        {editorMode === 'json' && (
          <UIButton
            text={t('buttons.prettyify')}
            onClick={prettyPrintJson}
          />
        )}
      </div>

      <CodeMirror
        ref={editorRef}
        value={value}
        extensions={[EditorView.lineWrapping, ...extensions]}
        onChange={(val, viewUpdate) => {
          onChange(val);

          const view = viewUpdate.view;
          const cursor = view.state.selection.main.head;
          const beforeCursor = val.slice(0, cursor);

          setCursorPosition(cursor);

          if (beforeCursor.endsWith('{')) {
            const coords = view.coordsAtPos(cursor);

            if (coords) {
              setDropdownPosition({ top: coords.bottom + window.scrollY, left: coords.left + window.scrollX });
              setShowDropdown(true);
            }
          } else {
            setShowDropdown(false);
          }
        }}
        style={{
          textAlign: 'start',
          whiteSpace: 'pre-wrap',
          wordBreak: 'normal',
          wordWrap: 'break-word',
          marginBottom: '10px',
        }}
        minHeight="6rem"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          foldGutter: mode === 'json',
        }}
      />
      {showDropdown && variables?.length > 0 && (
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

                const editorView = editorRef.current?.view;

                if (!editorView) return;

                const current = editorView.state.doc.toString();
                const before = current.slice(0, cursorPosition - 0);
                const after = current.slice(cursorPosition);
                const updated = `${before}{${key}}${after}`;

                editorView.dispatch({
                  changes: { from: 0, to: current.length, insert: updated },
                });

                setShowDropdown(false);
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
