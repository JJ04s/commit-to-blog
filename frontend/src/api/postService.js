import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postService = {
  // 포스트 생성
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // 포스트 목록 조회
  getPosts: async (params) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // 특정 포스트 조회
  getPostBySha: async (sha) => {
    const response = await api.get(`/posts/${sha}`);
    return response.data;
  },

  // 포스트 수정
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // 포스트 삭제
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export default api;
