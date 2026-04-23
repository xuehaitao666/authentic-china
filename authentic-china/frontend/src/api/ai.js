import axios from 'axios';

// 根据环境配置自动指向后端地址（如果有跨域代理可调整）
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const chatWithAI = async (messages) => {
  try {
    const response = await axios.post(`${baseURL}/ai/chat`, {
      messages
    });
    return response.data;
  } catch (error) {
    console.error('Failed to chat with AI:', error);
    throw error;
  }
};
