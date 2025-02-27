import axios, { AxiosInstance } from 'axios';

const options = {
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
};

const axiosClient: AxiosInstance = axios.create(options);

export default axiosClient;
