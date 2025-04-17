import { describe, it, expect, afterEach, vi } from 'vitest';
import { makeRequest, Method } from './makeRequest';

global.fetch = vi.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ data: 'mocked data' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  ),
);

describe('makeRequest', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a successful response for a GET request', async () => {
    const mockResponse = { message: 'Success' };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const response = await makeRequest({
      method: Method.GET,
      url: 'https://api.example.com/data',
    });

    expect(response).toEqual({
      status: 200,
      result: mockResponse,
      method: Method.GET,
    });
  });

  it('should return an error response for a failed request', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValueOnce({ message: 'Not found' }),
    });

    const response = await makeRequest({
      method: Method.GET,
      url: 'https://api.example.com/data',
    });

    expect(response).toEqual({
      status: 404,
      error: 'Not found',
      method: Method.GET,
    });
  });

  it('should handle network errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    const response = await makeRequest({
      method: Method.POST,
      url: 'https://api.example.com/data',
      body: { key: 'value' },
    });

    expect(response).toEqual({
      status: 500,
      error: 'Network error',
      method: Method.POST,
    });
  });

  it('should return a request error if URL is not provided', async () => {
    const response = await makeRequest({
      method: Method.PUT,
      url: '',
    });

    expect(response).toEqual({
      status: 0,
      error: 'URL is required',
      method: Method.PUT,
    });
  });

  it('should handle a successful POST request with body', async () => {
    const mockResponse = { id: 1, name: 'New Item' };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const response = await makeRequest({
      method: Method.POST,
      url: 'https://api.example.com/data',
      body: { name: 'New Item' },
    });

    expect(response).toEqual({
      status: 201,
      result: mockResponse,
      method: Method.POST,
    });
  });
});
