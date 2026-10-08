import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateMomentInput, CreateReflectionInput } from '@seva/contracts';

export function useJourney() {
  return useQuery({
    queryKey: ['journey'],
    queryFn: async () => {
      const { data } = await apiClient.get('/journey');
      return data;
    },
  });
}

export function useAiMirror() {
  return useQuery({
    queryKey: ['mirror'],
    queryFn: async () => {
      const { data } = await apiClient.get('/mirror');
      return data;
    },
  });
}

export function useCreateMoment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMomentInput) => {
      const res = await apiClient.post('/moments', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journey'] }),
  });
}

export function useCreateReflection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReflectionInput) => {
      const res = await apiClient.post('/reflections', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey'] });
      queryClient.invalidateQueries({ queryKey: ['mirror'] });
    },
  });
}
