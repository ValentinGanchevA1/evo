import axiosInstance from './axiosInstance';

export const fetchUserProfile = () => axiosInstance.get('/user/profile');