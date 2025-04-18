import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import messages from '../messages/en.json';
import NotFound from './not-found';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => messages.NotFound[key as keyof typeof messages.NotFound]),
}));

describe('Not found page', () => {
  it('should render page with correct texts', async () => {
    render(await NotFound());

    expect(screen.getByText(messages.NotFound.title)).toBeInTheDocument();
    expect(screen.getByText(messages.NotFound.description)).toBeInTheDocument();
    expect(screen.getByText(messages.NotFound.backHome)).toBeInTheDocument();
  });
});
