import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { StructureNeedInput, CreateNeedInput } from '@seva/contracts';

export function useNeeds(filters?: { category?: string; status?: string }) {
  return useQuery({
    queryKey: ['needs', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/needs', { params: filters });
      return data;
    },
  });
}

export function useNeedDetail(id: string) {
  return useQuery({
    queryKey: ['needs', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/needs/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useStructureNeed() {
  return useMutation({
    mutationFn: async (data: StructureNeedInput) => {
      const res = await apiClient.post('/needs/structure', data);
      return res.data;
    },
  });
}

export function useCreateNeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateNeedInput) => {
      const res = await apiClient.post('/needs', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['needs'] }),
  });
}
