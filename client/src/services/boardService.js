import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// ใส่ Token ทุก Request อัตโนมัติ
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBoards = () => API.get('/boards');
export const getBoard = (id) => API.get(`/boards/${id}`);
export const createBoard = (data) => API.post('/boards', data);
export const updateBoard = (id, data) => API.put(`/boards/${id}`, data);
export const deleteBoard = (id) => API.delete(`/boards/${id}`);