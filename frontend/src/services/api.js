import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Jobs API
export const rsaAPI = {
  generateKeyPair: (data) => api.post('/api/generate', data),
  encryptMessage: (data) => api.post('/api/encrypt', data),
  decryptMessage: (data) => api.post('/api/decrypt', data),
};