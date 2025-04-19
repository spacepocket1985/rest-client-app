import { LangSwitcher } from './LangSwitcher';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter, usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(),
}));

describe('LangSwitcher', () => {
  const mockPush = vi.fn();
  const mockUsePathname = vi.mocked(usePathname);
  const mockUseRouter = vi.mocked(useRouter);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as never);
  });

  it('should render with English selected by default', () => {
    mockUsePathname.mockReturnValue('/en/some-page');

    render(<LangSwitcher />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select.value).toBe('en');
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('RU')).toBeInTheDocument();
  });

  it('should render with Russian selected when path starts with /ru', () => {
    mockUsePathname.mockReturnValue('/ru/some-page');

    render(<LangSwitcher />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select.value).toBe('ru');
  });

  it('should change language when selecting a different option', () => {
    mockUsePathname.mockReturnValue('/en/some-page');

    render(<LangSwitcher />);

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'ru' } });

    expect(mockPush).toHaveBeenCalledWith('/ru/some-page');
  });

  it('should not call router.push when selecting the same language', () => {
    mockUsePathname.mockReturnValue('/en/some-page');

    render(<LangSwitcher />);

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'en' } });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle paths without locale prefix', () => {
    mockUsePathname.mockReturnValue('/some-page');

    render(<LangSwitcher />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select.value).toBe('en');
  });
});
