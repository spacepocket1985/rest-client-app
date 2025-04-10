import { notFound } from 'next/navigation';
import RestClient from '@components/rest/RestClient';
import { decodeBase64, spaceInBase64 } from '@utils/base64';

export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export type MethodType = (typeof Method)[keyof typeof Method];

interface RestPageProps {
  params: {
    locale: string;
    slug: string[];
  };
  searchParams: {
    [key: string]: string;
  };
}

interface RequestParams {
  method: MethodType;
  url: string;
  body?: unknown;
  headers?: HeadersInit;
}

export const makeRequest = async ({
  method,
  url,
  body = null,
  headers = {},
}: RequestParams): Promise<{ result: string; status: number }> => {
  if (!url) return { result: '', status: 0 };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const { status } = response;
    const result = response.ok ? await response.json() : null;

    return { result: JSON.stringify(result, null, 2), status };
  } catch (error) {
    const e = error as Error;

    return { result: e.message, status: 500 };
  }
};

export default async function RestClientPage({ params, searchParams }: RestPageProps) {
  const { slug } = await params;
  const method = slug[1] || Method.GET;

  if (!(method.toUpperCase() in Method)) {
    notFound();
  }

  const endpoint = slug[2] && slug[2] !== spaceInBase64 ? decodeBase64(slug[2]) : '';
  const resolvedSearchParams = await searchParams;

  const headers: HeadersInit =
    Object.keys(resolvedSearchParams).length > 0 ?
      Object.fromEntries(Object.entries(resolvedSearchParams).map(([key, value]) => [key, value]))
    : {};

  const body = slug[3] && slug[3] !== spaceInBase64 ? decodeBase64(slug[3]) : '';

  const requestMethod = method.toUpperCase() as MethodType;

  const response = await makeRequest({
    method: requestMethod,
    url: endpoint,
    body,
    headers,
  });

  return <RestClient response={response} />; //
}
