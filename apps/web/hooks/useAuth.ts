import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthContext } from '@/components/providers/AuthProvider';
import type { LoginInput, SignupInput } from '@seva/contracts';

export function useLogin() {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.accessToken, data.user);
    },
  });
}

export function useSignup() {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: async (data: SignupInput) => {
      const response = await apiClient.post('/auth/signup', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.accessToken, data.user);
    },
  });
}
