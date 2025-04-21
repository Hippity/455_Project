import axios from "axios";

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "";
  }

  return "http://localhost:8000";
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// RSA API endpoints
export const rsaAPI = {
  generateKeyPair: (data) => api.post("/api/generate", data),
  encryptMessage: (data) => api.post("/api/encrypt", data),
  decryptMessage: (data) => api.post("/api/decrypt", data),
};

// Saved Ciphertext Endpoints
export const savedCiphertextAPI = {
  getAll: () => api.get("/api/saved-ciphertexts"),
  create: (data) => api.post("/api/saved-ciphertexts", data),
  delete: (id) => api.delete(`/api/saved-ciphertexts/${id}`),
  decrypt: (id) => api.post(`/api/saved-ciphertexts/${id}/decrypt`),
};

// User API Endpoints
export const userAPI = {
  userDetails: () => api.get("/.auth/me"),
};

// Extract Text API Endpoint
export const extractTextAPI = {
  extractText: (formData) =>
    api.post("/api/extract-text", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Avalanche Effect API Endpoint
export const avalancheAPI = {
  testEffect: (data) => api.post(`/api/avalanche`, data),
};

// Test response for authentication during development
export const devResponse = {
  data: [
    // Your mock user data here...
  ],
};