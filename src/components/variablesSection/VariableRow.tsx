import { useState } from 'react';
import { UIButton } from '@ui/UIButton';

interface VariableRowProps {
  variable: { key: string; value: string };
  variables: { key: string; value: string }[];
  onUpdate: (originalKey: string, updated: { key: string; value: string }) => void;
  onDelete: (key: string) => void;
}

export function VariableRow({ variable, variables, onUpdate, onDelete }: VariableRowProps) {
  const [editedKey, setEditedKey] = useState(variable.key);
  const [editedValue, setEditedValue] = useState(variable.value);

  const isChanged = editedKey !== variable.key || editedValue !== variable.value;
  const keyConflict = editedKey !== variable.key && variables.some((v) => v.key === editedKey);

  return (
    <div className="flex mb-2 items-center gap-2 w-[600px]">
      <input
        type="text"
        className="border rounded p-2 mr-2 w-[200px]"
        value={editedKey}
        onChange={(e) => setEditedKey(e.target.value)}
      />
      <input
        type="text"
        className="border rounded p-2 mr-2 w-[200px]"
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
      />
      <UIButton
        text="Update"
        disabled={!isChanged || keyConflict}
        onClick={() => onUpdate(variable.key, { key: editedKey, value: editedValue })}
      />
      <UIButton
        text="Delete"
        onClick={() => onDelete(variable.key)}
      />
    </div>
  );
}
