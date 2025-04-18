import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';
import RequestHeaders from './RequestHeaders';

const mockPush = vi.fn();

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    user: {},
    name: 'Alex',
    loading: false,
  }),
}));

const renderRequestHeaders = (locale = 'en', headers = mockHeaders) => {
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <RequestHeaders
        headers={headers}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onChange={mockOnChange}
        variables={[]}
      />
    </NextIntlClientProvider>,
  );
};

const mockHeaders = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer token' },
];

const mockOnAdd = vi.fn();
const mockOnRemove = vi.fn();
const mockOnChange = vi.fn();

describe('SignUpPage', () => {
  it('renders correctly with headers', () => {
    renderRequestHeaders();

    expect(screen.getByText('Headers')).toBeInTheDocument();

    const keyInputs = screen.getAllByPlaceholderText('Header Key');
    const valueInputs = screen.getAllByPlaceholderText('Header Value');

    expect(keyInputs).toHaveLength(2);
    expect(valueInputs).toHaveLength(2);

    expect(keyInputs[0]).toHaveValue('Content-Type');
    expect(valueInputs[0]).toHaveValue('application/json');
    expect(keyInputs[1]).toHaveValue('Authorization');
    expect(valueInputs[1]).toHaveValue('Bearer token');

    const addButtons = screen.getAllByText('+');
    const removeButtons = screen.getAllByText('-');

    expect(addButtons).toHaveLength(2);
    expect(removeButtons).toHaveLength(2);
  });

  it('calls onChange when input values change', () => {
    renderRequestHeaders();

    const keyInputs = screen.getAllByPlaceholderText('Header Key');
    const valueInputs = screen.getAllByPlaceholderText('Header Value');

    fireEvent.change(keyInputs[0], { target: { value: 'X-Custom-Header' } });
    expect(mockOnChange).toHaveBeenCalledWith(0, 'key', 'X-Custom-Header');

    fireEvent.change(valueInputs[1], { target: { value: 'New token' } });
    expect(mockOnChange).toHaveBeenCalledWith(1, 'value', 'New token');
  });

  it('calls onAdd when "+" and onRemove when "-" button is clicked', () => {
    renderRequestHeaders();

    const addButtons = screen.getAllByText('+');
    const removeButtons = screen.getAllByText('-');

    fireEvent.click(removeButtons[1]);
    expect(mockOnRemove).toHaveBeenCalledWith(1);

    fireEvent.click(addButtons[0]);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('renders correctly with empty headers', () => {
    renderRequestHeaders('en', []);

    expect(screen.queryByPlaceholderText('Header Key')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Header Value')).not.toBeInTheDocument();
  });
});
