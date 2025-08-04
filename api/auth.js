import api from './index';

export const loginAccount = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const signUpAccount = (userData) => {
  return api.post('/auth/signup', userData);
};

export const logoutAccount = () => {
  return api.post('/auth/logout');
};

export const refreshToken = () => {
  return api.post('/auth/refresh-token');
};