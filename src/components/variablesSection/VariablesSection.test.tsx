import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';
import VariablesSection from './VariablesSection';

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

// beforeEach(() => {
//   localStorage.setItem('rest-client-vars', JSON.stringify([{ key: 'varname', value: 'varvalue' }]));
// });
describe('VariablesSection with empty ls', () => {
  it('add an empty variable', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariablesSection />
      </NextIntlClientProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Variable name'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText('Variable value'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Add Variable'));

    // const keyInput = screen.getByDisplayValue('apiKey');
    // const valueInput = screen.getByDisplayValue('123');

    // fireEvent.change(keyInput, { target: { value: 'newKey' } });
    // fireEvent.change(valueInput, { target: { value: '999' } });

    // fireEvent.click(screen.getAllByText('Update')[1]);

    // expect(screen.getByDisplayValue('newKey')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
describe('VariablesSection', () => {
  beforeEach(() => {
    localStorage.setItem('rest-client-vars', JSON.stringify([{ key: 'varname', value: 'varvalue' }]));
  });
  it('prevents adding duplicate variable keys', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariablesSection />
      </NextIntlClientProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Variable name'), {
      target: { value: 'apiKey' },
    });
    fireEvent.change(screen.getByPlaceholderText('Variable value'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Add Variable'));

    fireEvent.change(screen.getByPlaceholderText('Variable name'), {
      target: { value: 'apiKey' },
    });
    fireEvent.change(screen.getByPlaceholderText('Variable value'), {
      target: { value: '456' },
    });
    fireEvent.click(screen.getByText('Add Variable'));

    expect(screen.getByText('A variable with this name already exists.')).toBeInTheDocument();
  });

  it('add and updates a variable', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariablesSection />
      </NextIntlClientProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Variable name'), {
      target: { value: 'apiKey' },
    });
    fireEvent.change(screen.getByPlaceholderText('Variable value'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Add Variable'));

    const keyInput = screen.getByDisplayValue('apiKey');
    const valueInput = screen.getByDisplayValue('123');

    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.change(valueInput, { target: { value: '999' } });

    fireEvent.click(screen.getAllByText('Update')[1]);

    expect(screen.getByDisplayValue('newKey')).toBeInTheDocument();
    expect(screen.getByDisplayValue('999')).toBeInTheDocument();
  });

  it('deletes a variable', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <VariablesSection />
      </NextIntlClientProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Variable name'), {
      target: { value: 'apiKey' },
    });
    fireEvent.change(screen.getByPlaceholderText('Variable value'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Add Variable'));

    fireEvent.click(screen.getAllByText('Delete')[1]);

    expect(screen.queryByDisplayValue('apiKey')).not.toBeInTheDocument();
  });
});
