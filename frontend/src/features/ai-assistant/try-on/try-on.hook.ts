import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useVirtualTryOn = () => {
  return useMutation({
    mutationFn: async ({ imageUrl, blueprintId }: { imageUrl: string; blueprintId: string }) => {
      const response = await axios.post(`${API_URL}/ai/try-on`, { imageUrl, blueprintId });
      return response.data;
    },
  });
};
