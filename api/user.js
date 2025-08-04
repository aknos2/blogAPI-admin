import api from './index';

export const fetchUserStats = () => api.get('/user/stats');