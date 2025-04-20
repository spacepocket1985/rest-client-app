'use client';

import { useTranslations } from 'next-intl';
import CodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { UIHeader } from '@ui/UIHeader';
import { UIButton } from '@ui/UIButton';
import { useRef, useState } from 'react';
import { notifyError } from '@utils/notify';
import { useDropdown } from '@utils/variables';
import DropdownList from './DropdownList';

type EditorModeType = 'json' | 'text';

export interface RequestBodyProps {
  value: string;
  onChange: (value: string) => void;
  mode?: EditorModeType;
  onModeChange?: (mode: EditorModeType) => void;
  variables: { key: string; value: string }[];
}

export default function RequestBody({ value, onChange, mode = 'json', onModeChange, variables }: RequestBodyProps) {
  const [editorMode, setEditorMode] = useState<EditorModeType>(mode);
  const extensions = editorMode === 'json' ? [json()] : [];

  const { showDropdown, dropdownPosition, openDropdown, closeDropdown } = useDropdown();
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
        data-testid="codeMirror"
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
              openDropdown({ top: coords.bottom + window.scrollY, left: coords.left + window.scrollX });
            }
          } else {
            closeDropdown();
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
      {variables?.length > 0 && (
        <DropdownList
          showDropdown={showDropdown}
          dropdownPosition={dropdownPosition}
          options={variables}
          onSelect={function (key: string): void {
            const editorView = editorRef.current?.view;

            if (!editorView) return;

            const current = editorView.state.doc.toString();
            const before = current.slice(0, cursorPosition - 0);
            const after = current.slice(cursorPosition);
            const updated = `${before}{${key}}${after}`;

            editorView.dispatch({
              changes: { from: 0, to: current.length, insert: updated },
            });

            closeDropdown();
          }}
        />
      )}
    </div>
  );
}
