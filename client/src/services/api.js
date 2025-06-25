// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
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
