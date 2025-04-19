import { notFound } from 'next/navigation';
import { ApiResponse, makeRequest, Method } from '@utils/makeRequest';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { decodeBase64, spaceInBase64 } from '@utils/base64';
import RestClientPage from './[...slug]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@utils/makeRequest', () => ({
  makeRequest: vi.fn(),
  Method: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
}));

vi.mock('@utils/base64', () => ({
  decodeBase64: vi.fn((str) => `decoded_${str}`),
  spaceInBase64: 'space_base64',
}));

describe('RestClientPage', () => {
  const mockMakeRequest = vi.mocked(makeRequest);
  const mockNotFound = vi.mocked(notFound);

  beforeEach(() => {
    vi.clearAllMocks();
    mockMakeRequest.mockResolvedValue({
      status: 200,
      result: null,
      method: Method.GET,
    });
  });

  it('should call notFound for invalid HTTP method', async () => {
    await RestClientPage({
      params: {
        locale: 'en',
        slug: ['INVALID'],
      },
      searchParams: {},
    });

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('should handle GET request without endpoint', async () => {
    await RestClientPage({
      params: {
        locale: 'en',
        slug: ['GET'],
      },
      searchParams: {},
    });

    expect(mockMakeRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '',
      body: '',
      headers: {},
    });
  });

  it('should handle POST request with endpoint and body', async () => {
    await RestClientPage({
      params: {
        locale: 'en',
        slug: ['POST', 'test_endpoint', 'test_body'],
      },
      searchParams: {},
    });

    expect(decodeBase64).toHaveBeenCalledWith('test_endpoint');
    expect(decodeBase64).toHaveBeenCalledWith('test_body');
    expect(mockMakeRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'decoded_test_endpoint',
      body: 'decoded_test_body',
      headers: {},
    });
  });

  it('should handle spaceInBase64 values', async () => {
    await RestClientPage({
      params: {
        locale: 'en',
        slug: ['PUT', spaceInBase64, spaceInBase64],
      },
      searchParams: {},
    });

    expect(mockMakeRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '',
      body: '',
      headers: {},
    });
  });

  it('should convert searchParams to headers', async () => {
    await RestClientPage({
      params: {
        locale: 'en',
        slug: ['DELETE', 'endpoint'],
      },
      searchParams: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    });

    expect(mockMakeRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'decoded_endpoint',
      body: '',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    });
  });

  it('should pass response and locale to RestClient', async () => {
    const mockResponse = {
      status: 200,
      result: null,
      method: Method.GET,
    } as ApiResponse<null>;

    mockMakeRequest.mockResolvedValueOnce(mockResponse);

    const result = await RestClientPage({
      params: {
        locale: 'ru',
        slug: ['GET', 'test'],
      },
      searchParams: {},
    });

    expect(result.props.response).toEqual(mockResponse);
    expect(result.props.locale).toBe('ru');
  });
});
