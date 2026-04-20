const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const isLanHost = /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname);
const API_BASE_URL = import.meta.env.VITE_API_URL
    || ((isLocalHost || isLanHost)
        ? `${window.location.protocol}//${window.location.hostname}:5000`
        : window.location.origin);

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
