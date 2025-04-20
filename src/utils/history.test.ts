import { describe, it, expect } from 'vitest';
import { addHistoryData } from './history';

describe('history', () => {
  it('adds a new history entry when no history exists', () => {
    localStorage.clear();

    const data = { method: 'GET', url: 'https://api.com', link: '123' };

    addHistoryData(data);

    const stored = JSON.parse(localStorage.getItem('history-requests') || '[]');

    expect(stored).toEqual([data]);
  });
  it('appends a new history entry to existing history', () => {
    const existing = [{ method: 'POST', url: 'https://a.com', link: 'aaa' }];

    localStorage.setItem('history-requests', JSON.stringify(existing));

    const newEntry = { method: 'GET', url: 'https://b.com', link: 'bbb' };

    addHistoryData(newEntry);

    const stored = JSON.parse(localStorage.getItem('history-requests') || '[]');

    expect(stored).toEqual([...existing, newEntry]);
  });
});
