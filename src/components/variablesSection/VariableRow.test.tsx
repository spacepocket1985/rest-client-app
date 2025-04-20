import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import messages from '../../messages/en.json';
import { VariableRow } from './VariableRow';
import { NextIntlClientProvider } from 'next-intl';

const mockVariable = { key: 'apiKey', value: '123' };

const mockVariables = [
  { key: 'apiKey', value: '123' },
  { key: 'userId', value: '456' },
];

describe('VariableRow', () => {
  it('renders inputs and buttons', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariableRow
          variable={mockVariable}
          variables={mockVariables}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByDisplayValue('apiKey')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('enables update when values change and calls onUpdate', () => {
    const onUpdate = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariableRow
          variable={mockVariable}
          variables={mockVariables}
          onUpdate={onUpdate}
          onDelete={vi.fn()}
        />
      </NextIntlClientProvider>,
    );

    const keyInput = screen.getByDisplayValue('apiKey') as HTMLInputElement;
    const valueInput = screen.getByDisplayValue('123') as HTMLInputElement;
    const updateButton = screen.getByText('Update');

    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.change(valueInput, { target: { value: '999' } });

    expect(updateButton).toBeEnabled();

    fireEvent.click(updateButton);

    expect(onUpdate).toHaveBeenCalledWith('apiKey', {
      key: 'newKey',
      value: '999',
    });
  });

  it('calls onDelete with correct key', () => {
    const onDelete = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariableRow
          variable={mockVariable}
          variables={mockVariables}
          onUpdate={vi.fn()}
          onDelete={onDelete}
        />
      </NextIntlClientProvider>,
    );

    fireEvent.click(screen.getByText('Delete'));

    expect(onDelete).toHaveBeenCalledWith('apiKey');
  });
});
