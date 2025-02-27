import axiosClient from './axiosClient';

const AUTH_ROOT = '/users';

export const userOnlineKeys = {
  all: ['userOnline'],
  getAllUser: () => [...userOnlineKeys.all, 'list'],
};

const userOnlineService = {
  getAllUser: () => axiosClient.get(`${AUTH_ROOT}/online`),
};

export default userOnlineService;
