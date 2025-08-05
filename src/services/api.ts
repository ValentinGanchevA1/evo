// src/services/api.ts - ENHANCED VERSION
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { errorHandler } from './errorHandler';
import { AppConfig } from '../config/app';

// Request/Response interceptor types
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

class ApiClient {
  private readonly client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: AppConfig.API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        errorHandler.handleError(error, 'API Request');
        return Promise.reject(error);
      }
    );

    // Response interceptor with token refresh logic
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Transform response to consistent format
        return {
          ...response,
          data: response.data.data || response.data,
        };
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue failed requests during refresh
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.refreshToken();
            this.processQueue(null);
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            store.dispatch(logout());
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        const handledError = errorHandler.handleError(error, 'API Response');
        return Promise.reject(handledError);
      }
    );
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${AppConfig.API_BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
          },
        }
      );

      // Update token in store
      // Note: You'd need to add a setToken action to authSlice
      // store.dispatch(setToken(response.data.token));

    } catch (error) {
      throw error;
    }
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods with enhanced error handling
  public async get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.client.get(url, { params });
    } catch (error) {
      throw errorHandler.handleError(error, `GET ${url}`);
    }
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.post(url, data, config);
    } catch (error) {
      throw errorHandler.handleError(error, `POST ${url}`);
    }
  }

  public async put<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.client.put(url, data);
    } catch (error) {
      throw errorHandler.handleError(error, `PUT ${url}`);
    }
  }

  public async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    try {
      return await this.client.delete(url);
    } catch (error) {
      throw errorHandler.handleError(error, `DELETE ${url}`);
    }
  }
}

export const apiClient = new ApiClient();
