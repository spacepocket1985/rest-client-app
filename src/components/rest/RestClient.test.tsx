import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestClient from './RestClient';
import { Method, ApiResponse } from '@utils/makeRequest';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = vi.fn();

  range.getClientRects = vi.fn(() => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: function* () {
        yield* [];
      },
    };
  });

  return range;
};

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    user: {},
    name: 'John',
  }),
}));

const mockResponse = {
  status: 200,
  result: null,
  method: Method.GET,
} as ApiResponse<null>;

const renderRestClient = (locale = 'en') => {
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <RestClient
        response={mockResponse}
        locale={locale}
      />
    </NextIntlClientProvider>,
  );
};

const PathName =
  '/en/rest-client/GET/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz/ewogICJ0aXRsZSI6ICJmYWtlVGl0bGUiLAogICJ1c2VySWQiOiAxLAogICJib2R5IjogImZha2VNZXNzYWdlIgp9';

describe('RestClient Component', () => {
  it('sets initial data based on URL', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: PathName,
        search: '',
      },
      writable: true,
    });
    renderRestClient();
    const urlInput = screen.getByPlaceholderText(/url/i) as HTMLInputElement;

    expect(urlInput.value).toBe('https://jsonplaceholder.typicode.com/posts');

    expect(screen.getByDisplayValue(Method.GET)).toBeInTheDocument();
    expect(screen.getByText(/fakeTitle/i)).toBeInTheDocument();
    expect(screen.getByText(/fakeMessage/i)).toBeInTheDocument();
    expect(screen.getByText(/userId/i)).toBeInTheDocument();
    expect(screen.getByText(200)).toBeInTheDocument();
    expect(screen.getByText(/curl --location 'https:\/\/jsonplaceholder\.typicode\.com\/posts'/i)).toBeInTheDocument();
  });

  it('should change method type', () => {
    renderRestClient();

    const methodSelect = screen.getByTestId('method') as HTMLSelectElement;

    fireEvent.change(methodSelect, { target: { value: 'POST' } });

    expect(methodSelect.value).toBe('POST');
  });

  it('should change language code type', () => {
    renderRestClient();

    const codeLangSelect = screen.getByTestId('language-select') as HTMLSelectElement;

    fireEvent.change(codeLangSelect, { target: { value: 'js-fetch' } });

    expect(codeLangSelect.value).toBe('js-fetch');
    expect(screen.getByText(/const requestOptions = {/, { selector: 'code' })).toBeInTheDocument();
    expect(
      screen.getByText(/fetch\("https:\/\/jsonplaceholder\.typicode\.com\/posts", requestOptions\)/),
    ).toBeInTheDocument();
  });
});
