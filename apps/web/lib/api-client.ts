import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies (like refresh token) with every request
});

// A simple in-memory store for the access token to avoid local storage XSS vulnerabilities
let currentAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  if (currentAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

// Response Interceptor: Handle 401 & Automatic Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = refreshResponse.data.accessToken;

        setAccessToken(newAccessToken);

        // Update the original request's authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g., refresh cookie expired) -> logout
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          // Trigger a global logout event or redirect to login
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
