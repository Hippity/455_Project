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


export const devResponse = {data : [
    {
      "access_token": "ya29.a0AeXRPp4a4l9j4voZH7E3j2ouMcNOBhr7SlMu-KtcDr_6JXFshmhkV48biKjtiNopGQtGItUFJRYvriI4zwvNg8gAXlSxMv2at1pgzOL_tPWnawenTQa6C4PsmZfIKZ5IiJTIXkIeTuRVV5w8xh0qRPISxySJxTp1-lu2ENGzpAaCgYKAeMSARISFQHGX2MilbXa-T5c2OCE5sf2eeSZ-A0177",
      "expires_on": "2025-03-28T10:41:21.9135544Z",
      "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5NjQxODcwMDI4ODQtaWFvZWR2cWRodmRyZnU2NnI0cTVlbmxsa2pnMHE1dGguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NjQxODcwMDI4ODQtaWFvZWR2cWRodmRyZnU2NnI0cTVlbmxsa2pnMHE1dGguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ3MDU0OTU0NzQ2Njg4MDYxOTAiLCJlbWFpbCI6InplYmliLnplaW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJwSkthMHRHNXdaNERCN0pEVWNtSEl3IiwibmFtZSI6IlplaW4gWmViaWIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSWp2cFdPcXB4eG1oaEd2VmpfOE56ZUFFbUtDeHYxZzE3Uk5sQnpyOVJTMW9rWllVTFY9czk2LWMiLCJnaXZlbl9uYW1lIjoiWmVpbiIsImZhbWlseV9uYW1lIjoiWmViaWIiLCJpYXQiOjE3NDMxNTQ4ODQsImV4cCI6MTc0MzE1ODQ4NH0.gkyYiCOl03IWxJ-_IVWmhddw3yrKBWBWzGQkBHZOIc4eKYPUYIFl6mKVFzYsUBgMG7Q-ewat3w5yraVkvfVShp7CaWN8DCTEJ9gIkIGRifITGD2d3_icNzuYFYneR22gi37QHhJW8eST80IJ8oLRiWTjWlLC3W7HDlFOJtAPHuD9UPF-IcLLmDzeiaZiFfe7KfvOtkWJe-DUa2DAnTcv6LjxAB2Kh-tYNpKpMXtYPUbhWBoTWajDiHSY3cXlReNdtfs8Zv4rOl47kSTP_hze1e_bbEfPpsGvrbcrtVLuPGlYyBZjy9vTWYcHLmPa2taJvdDefjhLwnZ9j5PIA7vSfg",
      "provider_name": "google",
      "user_claims": [
        { "typ": "iss", "val": "https://accounts.google.com" },
        {
          "typ": "azp",
          "val": "964187002884-iaoedvqdhvdrfu66r4q5enllkjg0q5th.apps.googleusercontent.com"
        },
        {
          "typ": "aud",
          "val": "964187002884-iaoedvqdhvdrfu66r4q5enllkjg0q5th.apps.googleusercontent.com"
        },
        {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
          "val": "114705495474668806190"
        },
        {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
          "val": "zebib.zein@gmail.com"
        },
        { "typ": "email_verified", "val": "true" },
        { "typ": "at_hash", "val": "pJKa0tG5wZ4DB7JDUcmHIw" },
        { "typ": "name", "val": "Zein Zebib" },
        {
          "typ": "picture",
          "val": "https://lh3.googleusercontent.com/a/ACg8ocIjvpWOqpxxmhhGvVj_8NzeAEmKCxv1g17RNlBzr9RS1okZYULV=s96-c"
        },
        {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
          "val": "Zein"
        },
        {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
          "val": "Zebib"
        },
        { "typ": "iat", "val": "1743154884" },
        { "typ": "exp", "val": "1743158484" }
      ],
      "user_id": "zebib.zein@gmail.com"
    }
  ]}
  