import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateSevaInput, JoinSevaInput } from '@seva/contracts';

export function useSevaList(filters?: { category?: string; status?: string; isTech?: boolean }) {
  return useQuery({
    queryKey: ['seva', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/seva', { params: filters });
      return data;
    },
  });
}

export function useSevaDetail(id: string) {
  return useQuery({
    queryKey: ['seva', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/seva/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSeva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSevaInput) => {
      const res = await apiClient.post('/seva', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seva'] }),
  });
}

export function useJoinSeva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JoinSevaInput }) => {
      const res = await apiClient.post(`/seva/${id}/join`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seva', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });
}
