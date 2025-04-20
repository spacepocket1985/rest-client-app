import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RequestBody, { RequestBodyProps } from './RequestBody';
import { notifyError } from '@utils/notify';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

vi.mock('@utils/notify', () => ({
  notifyError: vi.fn(),
}));

vi.mock('@uiw/react-codemirror', () => {
  return {
    __esModule: true,
    default: (props: {
      value: string | number | readonly string[] | undefined;
      onChange: (
        arg0: string,
        arg1: {
          view: {
            state: { selection: { main: { head: number } } };
            coordsAtPos: (pos: number) => { bottom: number; left: number };
          };
        },
      ) => void;
    }) => (
      <textarea
        data-testid="codeMirror"
        value={props.value}
        onChange={(e) => {
          const val = e.target.value;
          const fakeView = {
            state: { selection: { main: { head: val.length } } },
            coordsAtPos: () => ({ bottom: 100, left: 200 }),
          };

          props.onChange(val, { view: fakeView });
        }}
      />
    ),
    EditorView: { lineWrapping: 'lineWrapping' },
    ReactCodeMirrorRef: null,
  };
});

const mockOpenDropdown = vi.fn();
const mockCloseDropdown = vi.fn();

vi.mock('@utils/variables', () => ({
  useDropdown: () => ({
    showDropdown: false,
    dropdownPosition: { top: 0, left: 0 },
    openDropdown: mockOpenDropdown,
    closeDropdown: mockCloseDropdown,
  }),
  useLocalStorageVariables: () => [],
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

  it('should not show pretty button in text mode', () => {
    renderRequestBody({
      value: '',
      onChange: mockOnChange,
      mode: 'text',
      variables: [],
    });

    expect(screen.queryByText(messages.Rest.buttons.prettyify)).toBeNull();
  });

  it('should switch to text mode when selected', () => {
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

  it('opens the dropdown when CodeMirror value before cursor ends with "{"', async () => {
    renderRequestBody({
      value: '',
      onChange: mockOnChange,
      mode: 'json',
      variables: [{ key: 'var1', value: 'value1' }],
    });

    const codeMirrorEl = screen.getByTestId('codeMirror') as HTMLTextAreaElement;

    fireEvent.change(codeMirrorEl, { target: { value: 'hello{' } });
    await waitFor(() => {
      expect(mockOpenDropdown).toHaveBeenCalledWith({ top: 100, left: 200 });
    });
  });

  it('closes the dropdown when text does not end with "{"', async () => {
    renderRequestBody({
      value: 'no curly brace here',
      onChange: mockOnChange,
      mode: 'json',
      variables: [{ key: 'var1', value: 'value1' }],
    });

    const codeMirrorEl = screen.getByTestId('codeMirror') as HTMLTextAreaElement;

    fireEvent.change(codeMirrorEl, { target: { value: 'hello world' } });
    await waitFor(() => {
      expect(mockCloseDropdown).toHaveBeenCalled();
    });
  });

  it('pretty prints valid JSON when prettyify button is clicked', async () => {
    const minifiedJson = '{"name":"John","age":30}';

    renderRequestBody({
      value: minifiedJson,
      onChange: mockOnChange,
      mode: 'json',
      onModeChange: mockOnModeChange,
      variables: [],
    });

    const button = screen.getByText(messages.Rest.buttons.prettyify);

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(JSON.stringify(JSON.parse(minifiedJson), null, 2));
    });
  });

  it('calls notifyError when prettyPrintJson fails for invalid JSON', () => {
    const invalidJson = '{"name": "John"';

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
