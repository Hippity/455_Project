import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {

    if (process.env.NODE_ENV === 'production') {
    return '';  // Use relative URL in production
  }
  
  return 'http://localhost:8000';
};

// Create axios instance with dynamic base URL
const api = axios.create({
  baseURL: getBaseUrl(),
});

// RSA API endpoints
export const rsaAPI = {
  generateKeyPair: (data) => api.post('/api/generate', data),
  encryptMessage: (data) => api.post('/api/encrypt', data),
  decryptMessage: (data) => api.post('/api/decrypt', data),
};

export const userAPI = {
    userDetails: () => api.get('/.auth/me')
}
