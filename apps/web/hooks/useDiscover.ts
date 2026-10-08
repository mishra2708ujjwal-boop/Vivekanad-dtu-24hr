import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthContext } from '@/components/providers/AuthProvider';

export function useRecommendations() {
  const { isAuthenticated } = useAuthContext();
  
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data } = await apiClient.get('/recommendations');
      return data;
    },
    enabled: isAuthenticated,
  });
}
