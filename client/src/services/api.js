// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://resourcehub-7u3d.onrender.com/api',
});

API.interceptors.request.use((config) => {
  // Do NOT attach token on auth endpoints
  if (config.url.startsWith('/auth/')) return config;
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
API.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

// src/services/api.js
export const getFilesByFolder = async (folderId) => {
  const res = await API.get(`/files/folder/${folderId}`);
  return res.data;
};
export const searchFiles = async (params) => {
  const res = await API.get('/files/search', { params });
  return res.data;
};

export default API;
