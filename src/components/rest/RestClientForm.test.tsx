import { NextIntlClientProvider } from 'next-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestClientForm from './RestClientForm';
import { Method, MethodType, ApiResponse } from '@utils/makeRequest';
import messages from '../../messages/en.json';

const openDropdownMock = vi.fn();
const closeDropdownMock = vi.fn();

vi.mock('@utils/variables', async () => {
  const actual = await vi.importActual('@utils/variables');

  return {
    ...actual,
    useDropdown: () => ({
      showDropdown: false,
      dropdownPosition: {},
      openDropdown: openDropdownMock,
      closeDropdown: closeDropdownMock,
    }),
    useLocalStorageVariables: () => [],
  };
});

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

  vi.mock('./DropdownList', () => {
    return {
      default: (props: { onSelect: (arg: string) => void }) => (
        <button
          data-testid="dropdown-select"
          onClick={() => props.onSelect('varName')}
        >
          Select Variable
        </button>
      ),
    };
  });

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
  it('updates header value when header input is changed', () => {
    renderRestClientForm();
    const headerValueInput = screen.getByDisplayValue('application/json') as HTMLInputElement;

    fireEvent.change(headerValueInput, { target: { value: 'application/xml' } });
    expect(screen.getByDisplayValue('application/xml')).toBeInTheDocument();
  });

  it('calls openDropdown with the correct coordinates when textBeforeCursor ends with "{"', () => {
    renderRestClientForm();

    const urlInput = screen.getByPlaceholderText(/url/i) as HTMLInputElement;

    const fakeRect = { top: 100, left: 50, width: 300, height: 40, bottom: 140, right: 350 };

    urlInput.getBoundingClientRect = () => fakeRect as DOMRect;

    Object.defineProperty(urlInput, 'offsetHeight', { configurable: true, value: 20 });

    Object.defineProperty(urlInput, 'selectionStart', { configurable: true, value: 22 });

    fireEvent.change(urlInput, { target: { value: 'https://example.com{' } });

    expect(openDropdownMock).toHaveBeenCalledWith({
      top: fakeRect.top + 0 + 20,
      left: fakeRect.left + 0,
    });
  });

  it('inserts variable correctly into URL and closes dropdown', () => {
    renderRestClientForm();
    const urlInput = screen.getByPlaceholderText(/url/i) as HTMLInputElement;

    expect(urlInput.value).toBe('https://example.com');
    Object.defineProperty(urlInput, 'selectionStart', { value: 2, writable: true });
    fireEvent.click(screen.getByTestId('dropdown-select'));
    expect(urlInput.value).toBe('h{{varName}}tps://example.com');
  });
});
