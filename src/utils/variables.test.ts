import { vi, describe, beforeEach, it, expect } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { interpolateVariables, useDropdown, useLocalStorageVariables } from './variables';

describe('useLocalStorageVariables', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('returns parsed variables if valid JSON exists', async () => {
    localStorage.setItem('rest-client-vars', JSON.stringify([{ key: 'apiKey', value: '123' }]));

    const { result } = renderHook(() => useLocalStorageVariables());

    await waitFor(() => {
      expect(result.current).toEqual([{ key: 'apiKey', value: '123' }]);
    });
  });

  it('returns an empty array if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorageVariables());

    expect(result.current).toEqual([]);
  });

  it('returns parsed variables if valid JSON exists', () => {
    localStorage.setItem('rest-client-vars', JSON.stringify([{ key: 'apiKey', value: '123' }]));

    const { result } = renderHook(() => useLocalStorageVariables());

    expect(result.current).toEqual([{ key: 'apiKey', value: '123' }]);
  });

  it('handles invalid JSON gracefully', () => {
    console.error = vi.fn();
    localStorage.setItem('rest-client-vars', '{not valid json');

    const { result } = renderHook(() => useLocalStorageVariables());

    expect(result.current).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});

describe('useDropdown', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useDropdown());

    expect(result.current.showDropdown).toBe(false);
    expect(result.current.dropdownPosition).toEqual({ top: 0, left: 0 });
  });

  it('opens dropdown with position', () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.openDropdown({ top: 100, left: 200 });
    });

    expect(result.current.showDropdown).toBe(true);
    expect(result.current.dropdownPosition).toEqual({ top: 100, left: 200 });
  });

  it('closes dropdown', () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.openDropdown({ top: 10, left: 20 });
      result.current.closeDropdown();
    });

    expect(result.current.showDropdown).toBe(false);
  });
});

describe('interpolateVariables', () => {
  const vars = [
    { key: 'apiKey', value: '123' },
    { key: 'userId', value: 'abc' },
  ];

  it('replaces variables with values', () => {
    const str = 'Token: {{apiKey}}, User: {{userId}}';

    expect(interpolateVariables(str, vars)).toBe('Token: 123, User: abc');
  });

  it('leaves unmatched variables unchanged', () => {
    const str = 'Hello {{unknown}}';

    expect(interpolateVariables(str, vars)).toBe('Hello {{unknown}}');
  });

  it('trims keys inside {{ }}', () => {
    const str = 'Token: {{  apiKey  }}';

    expect(interpolateVariables(str, vars)).toBe('Token: 123');
  });
});
