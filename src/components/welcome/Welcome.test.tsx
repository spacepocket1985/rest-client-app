import Welcome from './Welcome';
import messages from '../../messages/en.json';
import { NextIntlClientProvider } from 'next-intl';

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    user: {},
    name: 'John',
  }),
}));

describe('Welcome', () => {
  it('should render welcome page', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={messages}
      >
        <Welcome />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText(`Welcome back, John!`)).toBeInTheDocument();
    expect(
      screen.getByText(
        `This application is a lightweight platform for using and building APIs. It supports method selection, URL inputs, and headers. It was created by a team of students during the React course at RS School. Try it out!`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(`Visit RS School Website`)).toBeInTheDocument();
    expect(screen.getByText(`Oleksandr Mazghin`)).toBeInTheDocument();
  });
});
