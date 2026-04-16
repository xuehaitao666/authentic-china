import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/social';

export const getPosts = async (params, token) => {
  const { data } = await axios.get(`${BASE_URL}/posts`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const createPost = async (postData, token) => {
  const { data } = await axios.post(`${BASE_URL}/posts`, postData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const deletePost = async (id, token) => {
  const { data } = await axios.delete(`${BASE_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const toggleLike = async (postId, token) => {
  const { data } = await axios.post(`${BASE_URL}/posts/like`, { postId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const getComments = async (postId, token) => {
  const { data } = await axios.get(`${BASE_URL}/posts/${postId}/comments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const addComment = async (commentData, token) => {
  const { data } = await axios.post(`${BASE_URL}/posts/comments`, commentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const deleteComment = async (id, token) => {
  const { data } = await axios.delete(`${BASE_URL}/comments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
