import { useState, useEffect } from 'react';

export function useLocalStorageVariables(key = 'rest-client-vars') {
  const [variables, setVariables] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const deduped = parsed.filter((item, index, self) => index === self.findIndex((t) => t.key === item.key));

          localStorage.setItem(key, JSON.stringify(deduped));

          setVariables(deduped);
        }
      } catch {
        localStorage.setItem(key, '[]');
      }
    }
  }, [key]);

  return variables;
}

export function useDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const openDropdown = (position: { top: number; left: number }) => {
    setDropdownPosition(position);
    setShowDropdown(true);
  };

  const closeDropdown = () => setShowDropdown(false);

  return { showDropdown, dropdownPosition, openDropdown, closeDropdown };
}

export function interpolateVariables(str: string, vars: { key: string; value: string }[]): string {
  return str.replace(/{{(.*?)}}/g, (_, key) => {
    const found = vars.find((v) => v.key === key.trim());

    return found ? found.value : `{{${key}}}`;
  });
}
