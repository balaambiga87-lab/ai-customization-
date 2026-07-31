import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useGenerateDesign = () => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const response = await axios.post(`${API_URL}/ai/generator`, { prompt });
      return response.data;
    },
  });
};
