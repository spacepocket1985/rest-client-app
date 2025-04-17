import { vi, describe, beforeEach, it, expect } from 'vitest';
import { notify } from './notify';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Notification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call toast.success when notify is called with success type', () => {
    const message = 'Success message';

    notify(message, 'success');

    expect(toast.success).toHaveBeenCalledWith(message, expect.any(Object));
  });

  it('should call toast.error when notify is called with error type', () => {
    const message = 'Error message';

    notify(message, 'error');

    expect(toast.error).toHaveBeenCalledWith(message, expect.any(Object));
  });

  it('should call toast.warn when notify is called with warning type', () => {
    const message = 'Warning message';

    notify(message, 'warning');

    expect(toast.warn).toHaveBeenCalledWith(message, expect.any(Object));
  });

  it('should call toast.info when notify is called with info type', () => {
    const message = 'Info message';

    notify(message, 'info');

    expect(toast.info).toHaveBeenCalledWith(message, expect.any(Object));
  });

  it('should merge custom options with default options', () => {
    const message = 'Custom options message';
    const customOptions = { autoClose: 1000, theme: 'dark' as const };

    notify(message, 'success', customOptions);

    expect(toast.success).toHaveBeenCalledWith(message, {
      ...customOptions,
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,

      theme: 'dark',
    });
  });

  it('should use default options when no options provided', () => {
    const message = 'Default options message';

    notify(message, 'error');

    expect(toast.error).toHaveBeenCalledWith(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });
  });
});
