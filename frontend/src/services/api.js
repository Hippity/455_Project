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

export const extractTextAPI = {
  extractText: (formData) =>
    api.post("/api/extract-text", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Test response for authentication during development
export const devResponse = {
  data: [
    {
      access_token: "",
      expires_on: "2025-03-28T10:41:21.9135544Z",
      id_token: "",
      provider_name: "google",
      user_claims: [
        { typ: "iss", val: "https://accounts.google.com" },
        {
          typ: "azp",
          val: "964187002884-iaoedvqdhvdrfu66r4q5enllkjg0q5th.apps.googleusercontent.com",
        },
        {
          typ: "aud",
          val: "964187002884-iaoedvqdhvdrfu66r4q5enllkjg0q5th.apps.googleusercontent.com",
        },
        {
          typ: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
          val: "114705495474668806190",
        },
        {
          typ: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
          val: "zebib.zein@gmail.com",
        },
        { typ: "email_verified", val: "true" },
        { typ: "at_hash", val: "pJKa0tG5wZ4DB7JDUcmHIw" },
        { typ: "name", val: "Zein Zebib" },
        {
          typ: "picture",
          val: "https://lh3.googleusercontent.com/a/ACg8ocIjvpWOqpxxmhhGvVj_8NzeAEmKCxv1g17RNlBzr9RS1okZYULV=s96-c",
        },
        {
          typ: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
          val: "Zein",
        },
        {
          typ: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
          val: "Zebib",
        },
        { typ: "iat", val: "1743154884" },
        { typ: "exp", val: "1743158484" },
      ],
      user_id: "zebib.zein@gmail.com",
    },
  ],
};
