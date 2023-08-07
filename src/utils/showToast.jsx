import { toast } from 'react-toastify';

export const ShowToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    className: "font-light text-sm",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  })
}