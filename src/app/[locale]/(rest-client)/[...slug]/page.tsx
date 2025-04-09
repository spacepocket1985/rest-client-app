import { notFound } from 'next/navigation';
import RestClient from '@components/rest/RestClient';

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
  searchParams?: Record<string, string>;
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

export default async function RestClientPage({ params }: RestPageProps) {
  const [method = ''] = params.slug;

  if (!(method.toUpperCase() in Method)) {
    notFound();
  }

  // const requestMethod = method.toUpperCase() as MethodType;

  // const url = 'https://jsonplaceholder.typicode.com/posts/1';
  // const body = {};
  // const headers = { 'Content-Type': 'application/json' };

  // const response = await makeRequest({
  //   method: requestMethod, // Pass the method here
  //   url,
  //   body,
  //   headers,
  // });

  return <RestClient />;
}
