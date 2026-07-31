import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const login = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};
