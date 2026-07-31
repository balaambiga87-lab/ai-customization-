import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/ai/recommendations`, {
        params: { userId },
      });
      return response.data;
    },
    enabled: !!userId,
  });
};
