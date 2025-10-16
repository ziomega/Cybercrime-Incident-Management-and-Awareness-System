import axiosInstance from './axiosConfig';
import { refreshToken } from './auth';

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/users/me', profileData);
        return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};