import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('should return correct value', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
