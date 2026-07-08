import axios from "axios";
import { store } from "@/store";
import { setTokens, logout } from "@/store/slices/authSlice";
import { tokenService } from "@/services/token.service";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry only once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().auth.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Use plain axios to avoid interceptor loop
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        // Update Secure Store
        await tokenService.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );

        // Update Redux
        store.dispatch(
          setTokens({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          }),
        );

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        // Clear local data
        await tokenService.removeTokens();

        store.dispatch(logout());

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
