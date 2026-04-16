import axios from 'axios';

// 从名册中真实索取该城所有的挂牌风景与驻扎主家
export const getCityDetail = async (cityName) => {
  try {
    // 直连真实数据库的城池查询枢纽
    const res = await axios.get(`http://localhost:3000/api/v1/cities/${encodeURIComponent(cityName)}`);
    return res.data;
  } catch (error) {
    // 如果无此城池则抛出由 Axios 拦截的服务器错误
    console.error('API Error:', error);
    throw error;
  }
}

export const getCities = async () => {
  const { data } = await axios.get('http://localhost:3000/api/v1/cities');
  return data;
}

// 真·后台预订账本请求
export const submitOrder = async (orderData) => {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/orders', orderData);
    return res.data;
  } catch(e) {
    alert(e.response?.data?.message || '风雪阻路，拜帖信使遭遇了断联异常。');
    throw e;
  }
}
