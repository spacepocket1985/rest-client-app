import { NextIntlClientProvider } from 'next-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestClientForm from './RestClientForm';
import { Method, MethodType, ApiResponse } from '@utils/makeRequest';
import messages from '../../messages/en.json';

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    user: {},
    name: 'John',
  }),
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

describe('RestClientForm Component', () => {
  const mockHandleUrl = vi.fn();

  const initialProps = {
    initialMethod: Method.GET as MethodType,
    initialUrl: 'https://example.com',
    initialBody: '{"key": "value"}',
    initialHeaders: [{ key: 'Content-Type', value: 'application/json' }],
    response: {
      status: 200,
      result: null,
      method: Method.GET,
    } as ApiResponse<null>,
    isLoading: false,
    handleUrl: mockHandleUrl,
  };

  const renderRestClientForm = () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <RestClientForm {...initialProps} />
      </NextIntlClientProvider>,
    );
  };

  it('renders correctly and handles input changes', () => {
    renderRestClientForm();

    const urlInput = screen.getByPlaceholderText(/url/i) as HTMLInputElement;

    expect(urlInput.value).toBe(initialProps.initialUrl);

    fireEvent.change(urlInput, { target: { value: 'https://new-url.com' } });
    expect(urlInput.value).toBe('https://new-url.com');
  });

  it('submits the form correctly', () => {
    renderRestClientForm();

    fireEvent.click(screen.getByRole('button', { name: /send request/i }));

    expect(mockHandleUrl).toHaveBeenCalledWith(
      true,
      initialProps.initialMethod,
      initialProps.initialUrl,
      initialProps.initialBody,
      [{ key: 'Content-Type', value: 'application/json' }],
    );
  });

  it('adds and removes headers', () => {
    renderRestClientForm();

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();

    fireEvent.click(screen.getByText('+'));
    expect(screen.getAllByPlaceholderText(/key/i).length).toBe(2);

    fireEvent.click(screen.getAllByText('-')[1]);
    expect(screen.getAllByPlaceholderText(/key/i).length).toBe(1);
  });

  it('renders loading spinner when loading', () => {
    const loadingProps = { ...initialProps, isLoading: true };

    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <RestClientForm {...loadingProps} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
