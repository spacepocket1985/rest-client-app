'use client';

import { useTranslations } from 'next-intl';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { UIHeader } from '@ui/UIHeader';
import { UIButton } from '@ui/UIButton';
import { useState } from 'react';
import { notifyError } from '@utils/notify';

type EditorModeType = 'json' | 'text';

interface RequestBodyProps {
  value: string;
  onChange: (value: string) => void;
  mode?: EditorModeType;
  onModeChange?: (mode: EditorModeType) => void;
}

export default function RequestBody({ value, onChange, mode = 'json', onModeChange }: RequestBodyProps) {
  const [editorMode, setEditorMode] = useState<EditorModeType>(mode);
  const extensions = editorMode === 'json' ? [json()] : [];

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
        value={value}
        extensions={[EditorView.lineWrapping, ...extensions]}
        onChange={onChange}
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
    </div>
  );
}
