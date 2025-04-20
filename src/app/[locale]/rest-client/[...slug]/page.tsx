// app/[locale]/rest/[[...slug]]/page.tsx
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { decodeBase64, spaceInBase64 } from '@utils/base64';
import { makeRequest, Method, MethodType } from '@utils/makeRequest';
import { Spinner } from '@components/spinner/Spinner';

interface RestPageProps {
  params: {
    locale: string;
    slug: string[];
  };
  searchParams: {
    [key: string]: string;
  };
}

const RestClient = dynamic(() => import('@components/rest/RestClient'), {
  loading: () => <Spinner />,
  ssr: true,
});

export default async function RestClientPage({ params, searchParams }: RestPageProps) {
  const { slug, locale } = params;

  const method = slug?.[0] || Method.GET;

  if (!(method.toUpperCase() in Method)) {
    notFound();
  }

  const endpoint = slug?.[1] && slug[1] !== spaceInBase64 ? decodeBase64(slug[1]) : '';
  const resolvedSearchParams = searchParams;

  const headers: HeadersInit =
    Object.keys(resolvedSearchParams).length > 0 ?
      Object.fromEntries(Object.entries(resolvedSearchParams).map(([key, value]) => [key, value]))
    : {};

  const body = slug?.[2] && slug[2] !== spaceInBase64 ? decodeBase64(slug[2]) : '';

  const requestMethod = method.toUpperCase() as MethodType;

  const response = await makeRequest({
    method: requestMethod,
    url: endpoint,
    body,
    headers,
  });

  return (
    <RestClient
      response={response}
      locale={locale}
    />
  );
}
