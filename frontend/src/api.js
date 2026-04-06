import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL,
});

export function registerStore(data) {
  return api.post('/register-store', data);
}

export function login(data) {
  return api.post('/login', data);
}

export function getMyStore(token) {
  return api.get('/my-store', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminStores(token) {
  return api.get('/admin/stores', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminConfirmPayment(token, storeId) {
  return api.post(
    '/admin/confirm-payment',
    { storeId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
