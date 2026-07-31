import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const saveDesign = async (designData: any) => {
  const response = await axios.post(`${API_URL}/designs`, designData);
  return response.data;
};

export const fetchUserDesigns = async () => {
  const response = await axios.get(`${API_URL}/designs`);
  return response.data;
};
