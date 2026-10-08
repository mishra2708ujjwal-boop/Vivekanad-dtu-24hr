import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ProfileUpdateInput, UserSkillsUpdateInput, SankalpInput } from '@seva/contracts';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/profile');
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileUpdateInput) => {
      const res = await apiClient.patch('/profile', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useUpdateSkills() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserSkillsUpdateInput) => {
      const res = await apiClient.put('/profile/skills', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useSetSankalp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SankalpInput) => {
      const res = await apiClient.post('/sankalp', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useSkillsCatalog() {
  return useQuery({
    queryKey: ['skills-catalog'],
    queryFn: async () => {
      const { data } = await apiClient.get('/skills');
      return data;
    },
  });
}
