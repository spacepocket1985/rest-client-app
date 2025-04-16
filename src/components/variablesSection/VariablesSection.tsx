'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { UIButton } from '@ui/UIButton';
import { useEffect, useState } from 'react';
import { VariableRow } from './VariableRow';

function VariablesSection() {
  const [variables, setVariables] = useState<{ key: string; value: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rest-client-vars');

      return saved ? JSON.parse(saved) : [];
    }

    return [];
  });

  const [newVariable, setNewVariable] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    localStorage.setItem('rest-client-vars', JSON.stringify(variables));
  }, [variables]);

  const handleAddVariable = () => {
    if (!newVariable.trim()) return;

    const keyExists = variables.some((v) => v.key === newVariable);

    if (keyExists) {
      alert('Variable key already exists. Please choose a unique name.');

      return;
    }

    setVariables((prev) => [...prev, { key: newVariable, value: newValue }]);
    setNewVariable('');
    setNewValue('');
  };

  return (
    <>
      <h2 className="text-4xl mt-2 mb-2">{`Variables`}</h2>
      <div className="flex flex-col">
        <div className="flex mb-2 justify-start gap-2 w-[600px]">
          {' '}
          <span className="w-[200px] text-start p-2 mr-2">Variable</span>
          <span className="w-[200px] text-start p-2 mr-2">Value</span>
        </div>
      </div>
      <div className="flex mb-2 items-center gap-2 w-[600px]">
        <input
          type="text"
          className="border rounded p-2 mr-2 w-[200px]"
          value={newVariable}
          onChange={(e) => setNewVariable(e.target.value)}
          placeholder={`Variable name`}
        />
        <input
          type="text"
          className="border rounded p-2 mr-2 w-[200px]"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Variable value`}
        />
        <UIButton
          onClick={handleAddVariable}
          text="Add Variable"
        />
      </div>
      {variables.map((v) => (
        <VariableRow
          key={v.key}
          variable={v}
          variables={variables}
          onUpdate={(originalKey, updated) => {
            if (originalKey !== updated.key && variables.some((v) => v.key === updated.key)) {
              alert('A variable with this key already exists.');

              return;
            }

            setVariables((prev) => prev.map((item) => (item.key === originalKey ? updated : item)));
          }}
          onDelete={(key) => {
            setVariables((prev) => prev.filter((item) => item.key !== key));
          }}
        />
      ))}
    </>
  );
}

export default ProtectedRoute(VariablesSection, AuthRequirement.WithAuth);
