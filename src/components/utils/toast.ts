import { toast, ToastOptions } from 'react-toastify';

// Basic toast configuration
const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light', // or 'dark'
};

export const showSuccess = (message: string): void => {
  toast.success(message, toastConfig);
};

export const showError = (message: string): void => {
  toast.error(message, toastConfig);
};

export const showInfo = (message: string): void => {
  toast.info(message, toastConfig);
};

export const showWarning = (message: string): void => {
  toast.warn(message, toastConfig);
};
