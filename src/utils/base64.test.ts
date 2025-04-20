import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64, spaceInBase64 } from './base64';

describe('Base64 Encoding & Decoding', () => {
  it('correctly encodes a string', () => {
    expect(encodeBase64('hello')).toBe('aGVsbG8');
    expect(encodeBase64('Base64 test')).toBe('QmFzZTY0IHRlc3Q');
    expect(encodeBase64('123456')).toBe('MTIzNDU2');
  });

  it('correctly decodes a Base64 string', () => {
    expect(decodeBase64('aGVsbG8')).toBe('hello');
    expect(decodeBase64('QmFzZTY0IHRlc3Q')).toBe('Base64 test');
    expect(decodeBase64('MTIzNDU2')).toBe('123456');
  });

  it('handles space encoding correctly', () => {
    expect(encodeBase64(' ')).toBe(spaceInBase64);
    expect(decodeBase64(spaceInBase64)).toBe(' ');
  });

  it('handles empty string input', () => {
    expect(encodeBase64('')).toBe('');
    expect(decodeBase64('')).toBe('');
  });

  it('handles padding restoration in decoding', () => {
    expect(decodeBase64('SGVsbG8gV29ybGQ')).toBe('Hello World');
    expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
  });
});
