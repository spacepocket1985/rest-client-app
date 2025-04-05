import Footer from './Footer';
import { NextIntlClientProvider } from 'next-intl';

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Footer', () => {
  it('should render links and year', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Footer />
      </NextIntlClientProvider>,
    );

    const links = screen.getAllByRole('link');
    const rsSchoolLink = links.find((link) => link.getAttribute('href')?.includes('school'));

    expect(rsSchoolLink).toBeInTheDocument();

    const githubLink = links.find((link) => link.getAttribute('href')?.includes('github'));

    expect(githubLink).toBeInTheDocument();

    const year = new Date().getFullYear();

    expect(screen.getByText(`© ${year}`)).toBeInTheDocument();
  });
});
