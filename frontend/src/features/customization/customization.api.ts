import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const fetchCustomizationOptions = async (blueprintId: string) => {
  const response = await axios.get(`${API_URL}/customization/options/${blueprintId}`);
  return response.data;
};

export const calculateCustomizationPrice = async (blueprintId: string, selections: any) => {
  const response = await axios.post(`${API_URL}/customization/price`, { blueprintId, selections });
  return response.data;
};
