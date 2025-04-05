import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark' | 'colored';
}

const defaultOptions: NotificationOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

export const notify = (message: string, type: NotificationType = 'info', options: NotificationOptions = {}): void => {
  const mergedOptions = { ...defaultOptions, ...options };

  switch (type) {
    case 'success':
      toast.success(message, mergedOptions);
      break;
    case 'error':
      toast.error(message, mergedOptions);
      break;
    case 'warning':
      toast.warn(message, mergedOptions);
      break;
    default:
      toast.info(message, mergedOptions);
  }
};

export const notifySuccess = (message: string, options?: NotificationOptions) => notify(message, 'success', options);

export const notifyError = (message: string, options?: NotificationOptions) => notify(message, 'error', options);

export const notifyInfo = (message: string, options?: NotificationOptions) => notify(message, 'info', options);

export const notifyWarning = (message: string, options?: NotificationOptions) => notify(message, 'warning', options);
