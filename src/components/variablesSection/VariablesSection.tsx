'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { UIButton } from '@ui/UIButton';
import { useEffect, useState } from 'react';

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
          text="save"
        />
      </div>
      {variables.map((v, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 w-[600px] mb-1"
        >
          <span className="w-[200px] p-2 border rounded">{v.key}</span>
          <span className="w-[200px] p-2 border rounded">{v.value}</span>
          <UIButton
            text="Delete"
            onClick={() => {
              setVariables(variables.filter((_, i) => i !== idx));
            }}
          />
        </div>
      ))}
    </>
  );
}

export default ProtectedRoute(VariablesSection, AuthRequirement.WithAuth);
