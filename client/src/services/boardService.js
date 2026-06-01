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
// Column Services
export const getColumns = (boardId) => API.get(`/boards/${boardId}/columns`);
export const createColumn = (boardId, data) => API.post(`/boards/${boardId}/columns`, data);
export const updateColumn = (boardId, id, data) => API.put(`/boards/${boardId}/columns/${id}`, data);
export const deleteColumn = (boardId, id) => API.delete(`/boards/${boardId}/columns/${id}`);