import axios from 'axios';

const getToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

const refreshToken = async () => {
  try {
    const response = await axios.post(`${process.env.VUE_APP_API_URL}/users/login/refresh/`, {
      refresh: getRefreshToken(),
    });
    const { access } = response.data.user;
    localStorage.setItem('access_token', access);
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

axios.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshToken();
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axios;
