import axiosClient from './axiosClient';

const AUTH_ROOT = '/auth';

const authService = {
  login: (data: { username: string }) =>
    axiosClient.post(`${AUTH_ROOT}/login`, data),
  logout: (data: { userId: string }) =>
    axiosClient.post(`${AUTH_ROOT}/logout`, data),
};

export default authService;
