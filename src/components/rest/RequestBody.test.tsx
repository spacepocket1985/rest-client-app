import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RequestBody, { RequestBodyProps } from './RequestBody';
import { notifyError } from '@utils/notify';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

vi.mock('@utils/notify', () => ({
  notifyError: vi.fn(),
}));

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

const renderRequestBody = (props: RequestBodyProps) => {
  return render(
    <NextIntlClientProvider
      locale="en"
      messages={messages}
    >
      <RequestBody {...props} />
    </NextIntlClientProvider>,
  );
};

describe('RequestBody', () => {
  const mockOnChange = vi.fn();
  const mockOnModeChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component and display the JSON option by default', () => {
    renderRequestBody({
      value: '',
      onChange: mockOnChange,
      variables: [],
    });

    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JSON')).toBeInTheDocument();
  });

  it('should change mode to text when selected', () => {
    renderRequestBody({
      value: '',
      onChange: mockOnChange,
      onModeChange: mockOnModeChange,
      variables: [],
    });

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'text' } });

    expect(mockOnModeChange).toHaveBeenCalledWith('text');
    expect(screen.getByDisplayValue('text')).toBeInTheDocument();
  });

  it('should call notifyError on invalid JSON', () => {
    const invalidJson = '{"key": "value"';

    renderRequestBody({
      value: invalidJson,
      onChange: mockOnChange,
      mode: 'json',
      variables: [],
    });

    const button = screen.getByText(/prettyify/i);

    fireEvent.click(button);

    expect(notifyError).toHaveBeenCalled();
  });
});
