import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const fetchProducts = async (filters: any) => {
  const response = await axios.get(`${API_URL}/catalog`, { params: filters });
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/catalog/${id}`);
  return response.data;
};
