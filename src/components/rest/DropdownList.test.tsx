import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DropdownList from './DropdownList';

describe('DropdownList', () => {
  const mockOnSelect = vi.fn();
  const baseProps = {
    showDropdown: true,
    dropdownPosition: { top: 100, left: 100 },
    options: [{ key: 'var1' }, { key: 'var2' }],
    onSelect: mockOnSelect,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when showDropdown is false', () => {
    const { container } = render(
      <DropdownList
        {...baseProps}
        showDropdown={false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render dropdown with correct position and options', () => {
    render(<DropdownList {...baseProps} />);

    const dropdown = screen.getByRole('list');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveStyle({
      top: '100px',
      left: '100px',
    });

    expect(screen.getByText('var1')).toBeInTheDocument();
    expect(screen.getByText('var2')).toBeInTheDocument();
  });

  it('should call onSelect with correct key when option is clicked', () => {
    render(<DropdownList {...baseProps} />);

    const option1 = screen.getByText('var1');

    fireEvent.mouseDown(option1);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('var1');
  });

  it('should render empty list when no options provided', () => {
    render(
      <DropdownList
        {...baseProps}
        options={[]}
      />,
    );

    const dropdown = screen.getByRole('list');

    expect(dropdown).toBeInTheDocument();
    expect(screen.queryByText('var1')).not.toBeInTheDocument();
  });
});
